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
            console.log(payload);
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
    return { createjob, updatejob };
};
