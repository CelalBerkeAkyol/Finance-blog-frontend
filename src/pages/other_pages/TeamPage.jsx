import React, { useEffect } from "react";
import { Spinner } from "@nextui-org/react";
import CustomNavbar from "../../components/header/CustomNavbar";
import TeamMemberCard from "../../components/authors/TeamMemberCard";
import { useFeedback } from "../../context/FeedbackContext";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTeamMembers,
  selectTeamMembers,
  selectIsTeamLoading,
  selectIsTeamError,
} from "../../app/features/user/teamSlice";

const TeamPage = () => {
  const { error: showError } = useFeedback();
  const dispatch = useDispatch();

  // Get team members from Redux store using selectors
  const teamMembers = useSelector(selectTeamMembers);
  const isTeamLoading = useSelector(selectIsTeamLoading);
  const isTeamError = useSelector(selectIsTeamError);
  const teamErrorMessage = useSelector((state) => state.team.errorMessage);

  useEffect(() => {
    // Fetch team members using Redux thunk
    dispatch(fetchTeamMembers());
  }, [dispatch]);

  useEffect(() => {
    // Show error if fetching fails
    if (isTeamError) {
      showError("Failed to load team members: " + teamErrorMessage);
    }
  }, [isTeamError, teamErrorMessage, showError]);

  return (
    <div className="flex flex-col min-h-screen">
      <CustomNavbar />
      <main className="flex-grow">
        <div className="bg-white py-2 mb-12 min-h-full">
          <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
            <div className="mx-auto my-4 sm:my-6 text-start bg-gradient-to-r from-gray-800 to-gray-700 text-white py-4 px-4 rounded-lg shadow-lg">
              <h1 className="text-2xl sm:text-3xl font-bold">Yazarlarımız</h1>
              <p className="mt-2 text-sm sm:text-base text-gray-300">
                Cassandra'nın değerli içerik üreticileri ve uzmanları
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              {isTeamLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Spinner
                    size="lg"
                    color="primary"
                    label="Yazarlar yükleniyor..."
                  />
                </div>
              ) : teamMembers.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Henüz yazar bulunmamaktadır.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
                  {teamMembers.map((member) => (
                    <TeamMemberCard key={member._id} author={member} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeamPage;
