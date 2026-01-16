import { useAuthContext } from "./useAuthContext.js";
import api from "../utils/api.js";

export const useJobCreation = () => {
    const { user } = useAuthContext();
    const createjob = async (job) => {
        if (!user || user.role !== "company") {
            throw new Error("Only companies can create jobs");
        }
        try {
            const payload = {
                ...job,
            };
            const response = await api.post("/jobs/create", payload, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            return response.data;
        } catch (error) {
            const errorMessage =
                error.response?.data?.error ||
                error.message ||
                "An unexpected error occurred";
            throw errorMessage;
        }
    };
    const updatejob = async (job) => {
        if (!user || user._id !== job.postedBy) {
            throw "this is not your job to update";
        }
        try {
            const payload = {
                ...job,
                user_id: user._id,
            };
            const response = await api.put(`/jobs/${job._id}`, payload, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            return response.data;
        } catch (error) {
            const errorMessage =
                error.response?.data?.error ||
                error.message ||
                "An unexpected error occurred";
            throw errorMessage;
        }
    };
    const applyjob = async (applicationData) => {
        if (!user || user.role !== "user") {
            throw new Error("Only users can apply for jobs");
        }
        try {
            const payload = {
                ...applicationData,
                user_id: user._id,
            };
            const response = await api.post(
                `/jobs/${applicationData._id}/apply`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            const errorMessage =
                error.response?.data?.error ||
                error.message ||
                "An unexpected error occurred";
            throw errorMessage;
        }
    };
    return { createjob, updatejob, applyjob };
};
