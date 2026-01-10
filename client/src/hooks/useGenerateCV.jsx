import { useState } from "react";
import { Download, Loader } from "lucide-react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    pdf,
} from "@react-pdf/renderer";

// Define PDF styles
const styles = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: "#ffffff",
        fontFamily: "Helvetica",
    },
    header: {
        marginBottom: 20,
        textAlign: "center",
        borderBottomWidth: 2,
        borderBottomColor: "#2563eb",
        paddingBottom: 10,
    },
    name: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 12,
        color: "#666666",
        marginBottom: 3,
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "bold",
        backgroundColor: "#f3f4f6",
        padding: 8,
        marginBottom: 8,
        borderLeftWidth: 4,
        borderLeftColor: "#2563eb",
    },
    jobTitle: {
        fontSize: 11,
        fontWeight: "bold",
        marginBottom: 2,
    },
    company: {
        fontSize: 10,
        color: "#2563eb",
        marginBottom: 2,
    },
    date: {
        fontSize: 9,
        color: "#999999",
    },
    description: {
        fontSize: 10,
        marginTop: 4,
        color: "#444444",
        lineHeight: 1.4,
    },
    skillsContainer: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 5,
    },
    skillBadge: {
        backgroundColor: "#2563eb",
        color: "white",
        padding: "4 8",
        borderRadius: 3,
        fontSize: 9,
        marginBottom: 5,
        marginRight: 5,
    },
    infoText: {
        fontSize: 10,
        marginBottom: 4,
        color: "#444444",
    },
    label: {
        fontWeight: "bold",
        marginRight: 5,
    },
});

// CV Document Component
const CVDocument = ({ userData, profileData }) => {
    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
        });
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.name}>
                        {profileData.firstName || ""}{" "}
                        {profileData.lastName || ""}
                    </Text>
                    {profileData.description && (
                        <Text style={styles.subtitle}>
                            {profileData.description}
                        </Text>
                    )}
                    {profileData.location && (
                        <Text style={styles.subtitle}>
                            {profileData.location}
                        </Text>
                    )}
                    {profileData.phoneNumber && (
                        <Text style={styles.subtitle}>
                            {profileData.phoneNumber}
                        </Text>
                    )}
                    <Text style={styles.subtitle}>{userData.email}</Text>
                </View>

                {/* Professional Summary */}
                {profileData.description && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            PROFESSIONAL SUMMARY
                        </Text>
                        <Text
                            style={{
                                fontSize: 10,
                                lineHeight: 1.5,
                                color: "#444444",
                            }}
                        >
                            {profileData.description}
                        </Text>
                    </View>
                )}

                {/* Experience */}
                {profileData.pastJobs && profileData.pastJobs.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>EXPERIENCE</Text>
                        {profileData.pastJobs.map((job, i) => (
                            <View key={i} style={{ marginBottom: 10 }}>
                                <Text style={styles.jobTitle}>
                                    {job.title || ""}
                                </Text>
                                <Text style={styles.company}>
                                    {job.company || ""}
                                </Text>
                                <Text style={styles.date}>
                                    {formatDate(job.startDate)} -{" "}
                                    {job.current
                                        ? "Present"
                                        : formatDate(job.endDate)}
                                </Text>
                                {job.description && (
                                    <Text style={styles.description}>
                                        {job.description}
                                    </Text>
                                )}
                            </View>
                        ))}
                    </View>
                )}

                {/* Education */}
                {profileData.education && profileData.education.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>EDUCATION</Text>
                        {profileData.education.map((edu, i) => (
                            <View key={i} style={{ marginBottom: 8 }}>
                                <Text style={styles.jobTitle}>
                                    {edu.degree || ""}
                                </Text>
                                <Text style={styles.company}>
                                    {edu.institution || ""}
                                </Text>
                                {edu.field && (
                                    <Text style={styles.date}>
                                        Field of Study: {edu.field}
                                    </Text>
                                )}
                                {(edu.startDate || edu.endDate) && (
                                    <Text style={styles.date}>
                                        {formatDate(edu.startDate)} -{" "}
                                        {edu.current
                                            ? "Present"
                                            : formatDate(edu.endDate)}
                                    </Text>
                                )}
                            </View>
                        ))}
                    </View>
                )}

                {/* Skills */}
                {profileData.skills && profileData.skills.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>SKILLS</Text>
                        <View style={styles.skillsContainer}>
                            {profileData.skills.map((skill, i) => (
                                <Text key={i} style={styles.skillBadge}>
                                    {skill}
                                </Text>
                            ))}
                        </View>
                    </View>
                )}

                {/* Additional Information */}
                {(profileData.companyName ||
                    profileData.website ||
                    profileData.phoneNumber) && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            ADDITIONAL INFORMATION
                        </Text>
                        {profileData.companyName && (
                            <View
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    marginBottom: 4,
                                }}
                            >
                                <Text style={[styles.label, { width: 60 }]}>
                                    Company:
                                </Text>
                                <Text style={styles.infoText}>
                                    {profileData.companyName}
                                </Text>
                            </View>
                        )}
                        {profileData.website && (
                            <View
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    marginBottom: 4,
                                }}
                            >
                                <Text style={[styles.label, { width: 60 }]}>
                                    Website:
                                </Text>
                                <Text style={styles.infoText}>
                                    {profileData.website}
                                </Text>
                            </View>
                        )}
                        {profileData.phoneNumber && (
                            <View
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                }}
                            >
                                <Text style={[styles.label, { width: 60 }]}>
                                    Phone:
                                </Text>
                                <Text style={styles.infoText}>
                                    {profileData.phoneNumber}
                                </Text>
                            </View>
                        )}
                    </View>
                )}
            </Page>
        </Document>
    );
};

// Hook for CV generation
export const useGenerateCV = () => {
    const [loading, setLoading] = useState(false);

    const generateCV = async (userData, profileData) => {
        setLoading(true);
        try {
            const doc = (
                <CVDocument userData={userData} profileData={profileData} />
            );
            const blob = await pdf(doc).toBlob();

            // Create download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${
                profileData.firstName || userData.username
            }_CV.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error generating CV:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { generateCV, loading };
};

export { CVDocument };
