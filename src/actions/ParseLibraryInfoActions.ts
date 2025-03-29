"use server";

import { checkSession, SessionCheckResponse } from "@/lib/auth";
import { Library } from "@/types/StudySessionModelTypes";
import * as cheerio from "cheerio";
import createFuzzySearch from "@nozbe/microfuzz";

export async function fetchLibraryInfo(inAdminMode: boolean = false) {
  const sessionCheck: SessionCheckResponse = await checkSession(
    ["explore"],
    inAdminMode,
  );

  if (!sessionCheck.ok)
    return JSON.stringify({
      status: 401,
      responseData: { error: "Not authorized" },
    });

  const url = "https://www.lib.berkeley.edu/hours";

  try {
    const response = await fetch(url);
    const html = await response.text();

    const $ = cheerio.load(html);
    const libraries: Library[] = [];

    $(".library-hours-listing").each((_, element) => {
      const infoElement = $(element).find(".library-hours-listing-info");
      const name = $(infoElement).find(".library-name").text().trim();
      const hours = $(infoElement).find(".library-hours").text().trim();

      if (name) {
        const fuzzySearch = createFuzzySearch([hours]);

        const closedMatch = fuzzySearch("closed");
        const allDayMatch = fuzzySearch("24 hours");

        if (closedMatch[0].score > 80) {
          libraries.push({ name, hoursStart: null, hoursEnd: null });
        } else if (allDayMatch[0].score > 80) {
          libraries.push({ name, hoursStart: "12 a.m", hoursEnd: "12 a.m" });
        } else {
          const firstPart = hours.split(" ")[0].trim();
          const parts = firstPart.split("-");

          const hoursStart = parts[0];
          const hoursEnd = parts[1];
          libraries.push({ name, hoursStart, hoursEnd });
        }
      }
    });

    return JSON.stringify({
      status: 200,
      responseData: { libraries },
    });
  } catch (error) {
    return JSON.stringify({
      status: 500,
      responseData: { error: "Error in fetching library info" },
    });
  }
}
