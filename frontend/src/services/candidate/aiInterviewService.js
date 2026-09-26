import api from "../api";

export const getAIInterviewQuestions = async (interviewId) => {
  const response = await api.get(
    `/candidate/interviews/${interviewId}/questions/`
  );

  return response.data;
};


export const submitAIInterviewVoiceAnswer = async (
  questionId,
  audioBlob,
  answerText
) => {
  const formData = new FormData();

  formData.append(
    "audio_recording",
    audioBlob,
    "candidate_answer.webm"
  );

  formData.append("answer_text", answerText);

  const response = await api.post(
    `/candidate/interviews/questions/${questionId}/answer/`,
    formData
  );

  return response.data;
};


export const submitAIInterviewCodingAnswer = async (
  questionId,
  submittedCode
) => {
  const response = await api.post(
    `/candidate/interviews/questions/${questionId}/answer/`,
    {
      submitted_code: submittedCode,
    }
  );

  return response.data;
};