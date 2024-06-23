"use client";

import { useBetterMediaQuery } from "@/lib/hooks";
import { handleError } from "@/lib/utils";
import { FriendUserType, StrangerUserType } from "@/types/UserModelTypes";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  useToast,
  ToastId,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ActionResponse } from "@/types/RequestDataTypes";
import {
  acceptFriendRequest,
  deleteFriend,
  deleteIncomingFriendRequest,
  deleteOutgoingFriendRequest,
} from "@/actions/RequestsModifyActions";
import FriendRequestListItem from "./FriendRequestListItem";
import FriendListItem from "./FriendListItem";

interface SocialPageLayoutProps {
  friendsList: FriendUserType[] | null;
  outgoingRequestsList: StrangerUserType[] | null;
  incomingRequestsList: StrangerUserType[] | null;
  error: string | null;
  success: boolean;
}

export default function SocialPageLayout({
  friendsList,
  outgoingRequestsList,
  incomingRequestsList,
  error,
  success,
}: SocialPageLayoutProps) {
  const [requestsState, setRequestsState] = useState<
    "Incoming Requests" | "Friends" | "Outgoing Requests"
  >("Incoming Requests");
  const [incomingRequestsListState, setIncomingRequestsListState] = useState<
    StrangerUserType[]
  >(incomingRequestsList ?? []);
  const [outgoingRequestsListState, setOutgoingRequestsListState] = useState<
    StrangerUserType[]
  >(outgoingRequestsList ?? []);
  const [friendsListState, setFriendsListState] = useState<FriendUserType[]>(
    friendsList ?? [],
  );

  const toast = useToast();
  const toastRef = React.useRef<ToastId>();

  const isMobile = useBetterMediaQuery({
    query: "(max-width: 768px)",
  });

  useEffect(() => {
    if (toastRef.current) return;
    if (!success) {
      toastRef.current = toast({
        title: error,
        status: "error",
        duration: 2000,
        isClosable: false,
      });
    }
  }, [error, success, toast]);

  const updateAllListStates = (response: ActionResponse) => {
    const {
      newIncomingRequestsList,
      newOutgoingRequestsList,
      newFriendsList,
    }: {
      newIncomingRequestsList: StrangerUserType[];
      newOutgoingRequestsList: StrangerUserType[];
      newFriendsList: FriendUserType[];
    } = response.responseData;

    setIncomingRequestsListState(newIncomingRequestsList);
    setOutgoingRequestsListState(newOutgoingRequestsList);
    setFriendsListState(newFriendsList);
  };

  const handleRequest = async (
    backendFunction: (_dataString: string) => Promise<string>,
    otherUser: StrangerUserType | FriendUserType,
    successText: string,
  ) => {
    const response: ActionResponse = JSON.parse(
      await backendFunction(JSON.stringify({ otherUserId: otherUser._id })),
    );

    if (response.status === 200) {
      updateAllListStates(response);

      toast({
        title: successText,
        status: "success",
        duration: 2000,
        isClosable: false,
      });
    } else handleError(toast, response);
  };

  const friendsListComponent = (
    <div className="flex flex-col h-[600px] w-full overflow-y-auto overflow-x-hidden border-2 border-[#D8D8D8] rounded-lg">
      {(friendsListState ?? []).map(
        (request: FriendUserType, index: number) => (
          <div key={index}>
            <FriendListItem
              index={index}
              deleteCallBack={() =>
                handleRequest(deleteFriend, request, "Friend deleted")
              }
              profileImage={request.profileImage}
              major={request.major}
              gradYear={request.gradYear}
              firstName={request.firstName}
              lastName={request.lastName}
              userBio={request.userBio}
              pronouns={request.pronouns}
              courseList={request.courseList}
              userStudyPreferences={request.userStudyPreferences}
              fbURL={request.fbURL}
              igURL={request.igURL}
              email={request.email}
            />
          </div>
        ),
      )}
    </div>
  );

  const incomingRequestsListComponent = (
    <div className="flex flex-col h-[600px] w-full overflow-y-auto overflow-x-hidden border-2 border-[#D8D8D8] rounded-lg">
      {(incomingRequestsListState ?? []).map(
        (request: StrangerUserType, index: number) => (
          <div key={index}>
            <FriendRequestListItem
              index={index}
              acceptCallBack={() =>
                handleRequest(
                  acceptFriendRequest,
                  request,
                  "Friend request accepted",
                )
              }
              deleteCallBack={() =>
                handleRequest(
                  deleteIncomingFriendRequest,
                  request,
                  "Request deleted",
                )
              }
              profileImage={request.profileImage}
              major={request.major}
              gradYear={request.gradYear}
              firstName={request.firstName}
              lastName={request.lastName}
              userBio={request.userBio}
              pronouns={request.pronouns}
              courseList={request.courseList}
              userStudyPreferences={request.userStudyPreferences}
            />
          </div>
        ),
      )}
    </div>
  );

  const outgoingRequestsListComponent = (
    <div className="flex flex-col h-[600px] w-full overflow-y-auto overflow-x-hidden border-2 border-[#D8D8D8] rounded-lg">
      {(outgoingRequestsListState ?? []).map(
        (request: StrangerUserType, index: number) => (
          <div key={index}>
            <FriendRequestListItem
              index={index}
              deleteCallBack={() =>
                handleRequest(
                  deleteOutgoingFriendRequest,
                  outgoingRequestsListState[index],
                  "Request deleted",
                )
              }
              profileImage={request.profileImage}
              major={request.major}
              gradYear={request.gradYear}
              firstName={request.firstName}
              lastName={request.lastName}
              userBio={request.userBio}
              pronouns={request.pronouns}
              courseList={request.courseList}
              userStudyPreferences={request.userStudyPreferences}
            />
          </div>
        ),
      )}
    </div>
  );

  const resolveRequestListView = () => {
    if (requestsState === "Friends") return friendsListComponent;
    if (requestsState === "Incoming Requests")
      return incomingRequestsListComponent;
    if (requestsState === "Outgoing Requests")
      return outgoingRequestsListComponent;
  };

  const mobileLayout = () => (
    <Stack spacing={10} className="w-11/12 mx-auto py-[10%]">
      <Menu>
        <Button as={MenuButton} rightIcon={<ChevronDownIcon />}>
          {requestsState}
        </Button>
        <MenuList>
          <div>
            <MenuItem onClick={() => setRequestsState("Incoming Requests")}>
              Incoming Requests
            </MenuItem>
            <MenuItem onClick={() => setRequestsState("Friends")}>
              Friends
            </MenuItem>
            <MenuItem onClick={() => setRequestsState("Outgoing Requests")}>
              Outgoing Requests
            </MenuItem>
          </div>
        </MenuList>
      </Menu>
      {resolveRequestListView()}
    </Stack>
  );

  const desktopLayout = () => (
    <div className="w-[97.5%] mx-auto h-full py-[1.25%]">
      <Tabs className="w-full" align="center" variant="unstyled">
        <TabList>
          <Tab className="text-[#414141] font-[590] text-[18px]">
            Incoming Requests
          </Tab>
          <Tab className="text-[#414141] font-[590] text-[18px]">Friends</Tab>
          <Tab className="text-[#414141] font-[590] text-[18px]">
            Outgoing Requests
          </Tab>
        </TabList>
        <TabIndicator
          mt="-1.5px"
          height="3px"
          bg="#A73CFC"
          borderRadius="1px"
        />
        <TabPanels className="text-left p-2">
          <TabPanel className="p-0 pt-4">
            {incomingRequestsListComponent}
          </TabPanel>
          <TabPanel className="p-0 pt-4">{friendsListComponent}</TabPanel>
          <TabPanel className="p-0 pt-4">
            {outgoingRequestsListComponent}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );

  return (
    <div className="w-screen flex">
      {isMobile ? mobileLayout() : desktopLayout()}
    </div>
  );
}
