import ProfileSearchFilter from "./_components/ProfileSearchFilter";

export default async function Explore() {
  return (
    <div className="w-screen h-[calc(100vh_-_5rem)] flex flex-row">
      <div className="w-[20%]">
        <ProfileSearchFilter />
      </div>
      <div className="w-[80%]">
        <div className="h-full bg-[#FAFAFA]"></div>
      </div>
    </div>
  );
}
