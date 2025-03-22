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
} from "../../app/features/user/userSlice";

const TeamPage = () => {
  const { error: showError } = useFeedback();
  const dispatch = useDispatch();

  // Get team members from Redux store using selectors
  const teamMembers = useSelector(selectTeamMembers);
  const isTeamLoading = useSelector(selectIsTeamLoading);
  const isTeamError = useSelector(selectIsTeamError);
  const teamErrorMessage = useSelector((state) => state.user.teamErrorMessage);

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
    <>
      <CustomNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          Our Content Team
        </h1>
        <p className="text-lg text-center mb-8 max-w-3xl mx-auto">
          Meet the talented people behind the content you enjoy. Our team brings
          diverse expertise and perspectives to create valuable articles for our
          readers.
        </p>

        {isTeamLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner
              size="lg"
              color="primary"
              label="Loading team members..."
            />
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No team members found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {teamMembers.map((member) => (
              <TeamMemberCard key={member._id} author={member} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default TeamPage;
