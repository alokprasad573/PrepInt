export const BASE_URL = "http://localhost:8080";

export const API_PATHS = {
    AUTH: {
        REGISTER: "/api/auth/register", //Create Account
        LOGIN: "/api/auth/login", //Login into account
        GET_PROFILE: "/api/auth/profile" //Get logged-in user details
    },

    PROFILE_IMAGE: {
        UPLOAD_IMAGE: "/api/auth/upload-image" //Upload profile picture
    },

    AI: {
        GENEARTE_QUESTIONS: "/api/ai/generate-questions", //Generate Interview questions and answers using Gemeini
        GENERATE_EXPLANATION: "/api/ai/generate-explanation" //Generate concet expalanation using Gemini
    },

    SESSION: {
        CREATE: "/api/session/create", // Create a new interview session with questions
        GET_ALL: "/api/sessions/my-sessions",  // Get all user sessions
        GET_ONE_BY_ID: (id) => `/api/sessions/my-sessions/${id}`, // Get sessions details with questions 
        DELETE: (id) => `api/sessions/my-sessions/${id}` // Delete a session
    },

    QUESTIONS: {
        ADD_TO_SESSION: "/api/questions/add", // Add more questions to a session
        PIN: (id) => `/api/questions/${id}/pin`, // Pin or unpin a question
        UPDATE_NOTE: (id) => `/api/questions/${id}/note` // Update/Add a note to a question
    },
};