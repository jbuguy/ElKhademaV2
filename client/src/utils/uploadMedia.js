import api from "./api.js";
export const uploadMedia = async (file, type) => {
    const sigRes = await api.post("/media/signature", { type });
    const { signature, apiKey, cloudName, params } = sigRes.data;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("signature", signature);
    Object.entries(params).forEach(([key, value]) =>
        formData.append(key, value)
    );
    const resourceType = type === "pdf" ? "raw" : "auto";
    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
        { method: "POST", body: formData }
    );

    return res.json();
};
