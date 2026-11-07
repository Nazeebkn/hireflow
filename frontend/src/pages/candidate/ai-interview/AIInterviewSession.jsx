import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Brain,
  Clock3,
  Mic,
  MicOff,
  Code2,
  Send,
  CheckCircle2,
  XCircle,
  Volume2,
  ChevronRight,
  ShieldCheck,
  CircleDot,
} from "lucide-react";

import AIInterviewer from "../../../components/candidate/ai-interview/AIInterviewer";



import {
  getAIInterviewQuestions,
  submitAIInterviewVoiceAnswer,
  submitAIInterviewCodingAnswer,
  completeAIInterview,
} from "../../../services/candidate/aiInterviewService";
const AIInterviewSession = () => {
  const navigate = useNavigate();
  const { interviewId } = useParams();

  const [timeLeft, setTimeLeft] = useState(30 * 60);

  // ============================================================
  // RECORDING STATE
  // ============================================================

  const [audioBlob, setAudioBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // ============================================================
  // QUESTION STATE
  // ============================================================

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [questionsError, setQuestionsError] = useState("");

  // ============================================================
  // CODING STATE
  // ============================================================

  const [code, setCode] = useState("");
  const [testResults, setTestResults] = useState([]);

  // ============================================================
  // SUBMISSION STATE
  // ============================================================

  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);

  // ============================================================
  // INTERVIEW COMPLETION MODALS
  // ============================================================

  const [showCompleteConfirmModal, setShowCompleteConfirmModal] =
    useState(false);

  const [showCompletedModal, setShowCompletedModal] =
    useState(false);

  // ============================================================
  // CUSTOM TOAST
  // ============================================================

  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });

    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
      toastTimeoutRef.current = null;
    }, 3500);
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  // ============================================================
  // CURRENT QUESTION
  // ============================================================

  const currentQuestion = questions[currentQuestionIndex];

  const isTheoryQuestion =
    currentQuestion?.question_type === "THEORY";

  const isCodingQuestion =
    currentQuestion?.question_type === "CODING";

  const isLastQuestion =
    questions.length > 0 &&
    currentQuestionIndex === questions.length - 1;

  // ============================================================
  // INTERVIEW TIMER
  // ============================================================

  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // ============================================================
  // FETCH QUESTIONS
  // ============================================================

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setQuestionsLoading(true);
        setQuestionsError("");

        const data = await getAIInterviewQuestions(interviewId);

        console.log("INTERVIEW ID:", interviewId);
        console.log("QUESTIONS FROM BACKEND:", data);

        setQuestions(data?.questions || []);
      } catch (error) {
        console.error(
          "Failed to load interview questions:",
          error
        );

        setQuestionsError(
          error.response?.data?.message ||
            "Failed to load interview questions."
        );
      } finally {
        setQuestionsLoading(false);
      }
    };

    if (interviewId) {
      fetchQuestions();
    }
  }, [interviewId]);

  // ============================================================
  // RESET CURRENT QUESTION UI
  // ============================================================

  useEffect(() => {
    if (!currentQuestion) {
      setCode("");
      setTestResults([]);
      setAnswerSubmitted(false);
      return;
    }

    if (currentQuestion.question_type === "CODING") {
      setCode(currentQuestion.starter_code || "");
    } else {
      setCode("");
    }

    setTestResults([]);
    setAnswerSubmitted(false);
    setIsSubmittingAnswer(false);

    setAudioBlob(null);
    setRecordingTime(0);

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }

    audioChunksRef.current = [];
  }, [currentQuestionIndex, questions]);

  // ============================================================
  // RECORDING TIMER
  // ============================================================

  useEffect(() => {
    if (!isRecording) {
      return;
    }

    const interval = setInterval(() => {
      setRecordingTime((previous) => previous + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRecording]);

  // ============================================================
  // CLEANUP AUDIO URL
  // ============================================================

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // ============================================================
  // FORMAT TIME
  // ============================================================

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const formatRecordingTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  // ============================================================
  // RECORDING
  // ============================================================

  const handleRecording = async () => {
    // Never allow recording after submission
    if (answerSubmitted || isSubmittingAnswer) {
      return;
    }

    // ----------------------------------------------------------
    // STOP RECORDING
    // ----------------------------------------------------------

    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }

      setIsRecording(false);
      return;
    }

    // ----------------------------------------------------------
    // START RECORDING
    // ----------------------------------------------------------

    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

      const mimeType = MediaRecorder.isTypeSupported(
        "audio/webm"
      )
        ? "audio/webm"
        : "audio/ogg";

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const recordedBlob = new Blob(
          audioChunksRef.current,
          {
            type: mimeType,
          }
        );

        setAudioBlob(recordedBlob);

        const url = URL.createObjectURL(recordedBlob);

        setAudioUrl(url);

        stream.getTracks().forEach((track) => {
          track.stop();
        });

        console.log(
          "AUDIO BLOB CREATED:",
          recordedBlob
        );
      };

      mediaRecorder.start();

      setRecordingTime(0);
      setAudioUrl(null);
      setAudioBlob(null);
      setIsRecording(true);
    } catch (error) {
      console.error(
        "Microphone access failed:",
        error
      );

      showToast(
        "Microphone permission is required to record your answer.",
        "error"
      );
    }
  };

  // ============================================================
  // SUBMIT THEORY ANSWER
  // ============================================================

  const handleSubmitAnswer = async () => {
    if (!currentQuestion) {
      showToast("Current question not found.", "error");
      return;
    }

    if (!isTheoryQuestion) {
      return;
    }

    // Prevent duplicate submission
    if (answerSubmitted || isSubmittingAnswer) {
      return;
    }

    if (!audioBlob) {
      showToast(
        "Please record your answer before submitting.",
        "warning"
      );
      return;
    }

    try {
      setIsSubmittingAnswer(true);

      console.log(
        "SUBMITTING THEORY AUDIO:",
        audioBlob
      );

      const data =
        await submitAIInterviewVoiceAnswer(
          currentQuestion.id,
          audioBlob,
          "Audio answer submitted."
        );

      console.log(
        "VOICE ANSWER SUBMITTED:",
        data
      );

      // Lock this question
      setAnswerSubmitted(true);

      showToast(
        "Answer submitted successfully.",
        "success"
      );
    } catch (error) {
      console.error(
        "FAILED VOICE ANSWER:",
        error
      );

      showToast(
        error.response?.data?.message ||
          "Failed to submit your answer.",
        "error"
      );
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  // ============================================================
  // SUBMIT CODING ANSWER
  // ============================================================

  const handleSubmitCodingAnswer = async () => {
    if (!currentQuestion) {
      showToast("Current question not found.", "error");
      return;
    }

    if (!isCodingQuestion) {
      return;
    }

    // Prevent duplicate submission
    if (answerSubmitted || isSubmittingAnswer) {
      return;
    }

    if (!code.trim()) {
      showToast(
        "Please write your code before submitting.",
        "warning"
      );
      return;
    }

    try {
      setIsSubmittingAnswer(true);

      console.log(
        "SUBMITTING CODING ANSWER"
      );

      console.log(
        "QUESTION ID:",
        currentQuestion.id
      );

      console.log(
        "CODE:",
        code
      );

      const data =
        await submitAIInterviewCodingAnswer(
          currentQuestion.id,
          code
        );

      console.log(
        "CODING ANSWER SUBMITTED:",
        data
      );

      // --------------------------------------------------------
      // BACKEND TEST RESULTS
      // --------------------------------------------------------

      const backendResults =
        data?.answer?.test_results || [];

      const formattedResults =
        backendResults.map(
          (result, index) => ({
            id: index + 1,
            input: result.input ?? "",
            expected:
              result.expected_output ?? "",
            actual:
              result.actual_output ?? "",
            passed:
              result.passed === true,
            error:
              result.error ?? "",
          })
        );

      setTestResults(formattedResults);

      // Lock this question
      setAnswerSubmitted(true);
    } catch (error) {
      console.error(
        "FAILED CODING ANSWER:",
        error
      );

      showToast(
        error.response?.data?.message ||
          "Failed to submit coding answer.",
        "error"
      );
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  // ============================================================
  // NEXT QUESTION
  // ============================================================

  const handleNextQuestion = () => {
    if (
      mediaRecorderRef.current &&
      isRecording
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    setTestResults([]);
    setCode("");
    setAnswerSubmitted(false);
    setIsSubmittingAnswer(false);

    audioChunksRef.current = [];

    if (
      currentQuestionIndex <
      questions.length - 1
    ) {
      setCurrentQuestionIndex(
        (previous) => previous + 1
      );
    }
  };

  // ============================================================
  // OPEN COMPLETE INTERVIEW CONFIRMATION
  // ============================================================

  const handleSubmitInterview = () => {
    if (!isLastQuestion) {
      return;
    }

    setShowCompleteConfirmModal(true);
  };

  // ============================================================
  // CONFIRM INTERVIEW COMPLETION
  // ============================================================

const handleConfirmCompleteInterview = async () => {
  try {
    setShowCompleteConfirmModal(false);

    await completeAIInterview(interviewId);

    setShowCompletedModal(true);
  } catch (error) {
    console.error("Failed to complete AI interview:", error);
    showToast(
      error.response?.data?.message ||
        "Failed to complete the interview. Please try again.",
      "error"
    );
  }
};
  // ============================================================
  // GO TO APPLICATIONS
  // ============================================================

  const handleGoToApplications = () => {
    setShowCompletedModal(false);
    navigate(`/candidate/applications`);
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (questionsLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <p className="text-lg font-semibold">
            Loading interview questions...
          </p>

          <p className="mt-2 text-sm text-slate-400">
            Preparing your AI technical interview.
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (questionsError) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="max-w-md text-center">
          <p className="text-lg font-semibold text-red-400">
            Unable to load interview questions
          </p>

          <p className="mt-2 text-sm text-slate-400">
            {questionsError}
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // NO QUESTION
  // ============================================================

  if (!currentQuestion) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="text-center">
          <p className="text-lg font-semibold">
            No interview questions found.
          </p>

          <p className="mt-2 text-sm text-slate-400">
            Please try opening the interview again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-slate-950 text-white">

      {/* CUSTOM TOAST NOTIFICATION */}
      {toast && (
        <div
          className="fixed right-5 top-5 z-[100] w-[calc(100%-2.5rem)] max-w-sm"
          role={toast.type === "error" ? "alert" : "status"}
          aria-live={toast.type === "error" ? "assertive" : "polite"}
        >
          <div
            className={`flex items-start gap-3 rounded-xl border p-4 shadow-2xl backdrop-blur ${
              toast.type === "success"
                ? "border-emerald-200 bg-white text-emerald-800"
                : toast.type === "warning"
                  ? "border-amber-200 bg-white text-amber-800"
                  : "border-red-200 bg-white text-red-800"
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === "success" ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : toast.type === "warning" ? (
                <CircleDot className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
            </div>

            <p className="flex-1 text-sm font-medium leading-5">
              {toast.message}
            </p>

            <button
              type="button"
              onClick={() => setToast(null)}
              className="shrink-0 text-lg leading-none opacity-60 transition hover:opacity-100"
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* ======================================================
          TOP BAR
      ====================================================== */}

      <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-950 px-6">

        <div className="flex items-center gap-3">

          <div className="text-2xl font-extrabold tracking-tight">
            Hire
            <span className="text-blue-500">
              Flow
            </span>
          </div>

          <div className="hidden h-5 w-px bg-slate-700 sm:block" />

          <span className="hidden text-sm font-medium text-slate-400 sm:block">
            AI Technical Interview
          </span>

        </div>

        <div className="flex items-center gap-5">

          <div className="hidden items-center gap-2 sm:flex">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />

              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-500" />
            </span>

            <span className="text-xs font-semibold text-blue-400">
              LIVE
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2">
            <Clock3 className="h-4 w-4 text-blue-400" />

            <span className="font-mono text-sm font-semibold tracking-wide">
              {formatTime(timeLeft)}
            </span>
          </div>

        </div>
      </header>

      {/* ======================================================
          MAIN WORKSPACE
      ====================================================== */}

      <main className="flex h-[calc(100vh-64px)] min-h-0 flex-col overflow-hidden lg:flex-row">

        {/* ====================================================
            LEFT - AI INTERVIEWER
        ==================================================== */}

        <section className="flex h-full w-full shrink-0 flex-col overflow-hidden border-b border-slate-800 bg-slate-900 p-6 lg:w-[40%] lg:border-b-0 lg:border-r">

          <div className="mb-5 flex shrink-0 items-center justify-between">

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                AI Interviewer
              </p>

              <h2 className="mt-1 text-lg font-semibold text-white">
                HireFlow AI
              </h2>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2">
              <Volume2 className="h-4 w-4 text-blue-400" />

              <span className="text-xs text-slate-300">
                Speaking
              </span>
            </div>

          </div>

          <AIInterviewer
            question={
              currentQuestion?.question_text ||
              ""
            }
          />

          <div className="mt-5 shrink-0 rounded-xl border border-slate-800 bg-slate-950 p-4">

            <div className="flex gap-3">

              <CircleDot className="mt-0.5 h-4 w-4 text-blue-400" />

              <p className="text-sm leading-6 text-slate-400">
                Listen carefully to the question
                and provide your answer when you
                are ready.
              </p>

            </div>

          </div>

        </section>

        {/* ====================================================
            RIGHT - INTERVIEW CONTENT
        ==================================================== */}

        <section className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-slate-50 text-slate-900 lg:w-[60%]">

          {/* QUESTION HEADER */}

          <div className="shrink-0 border-b border-slate-200 bg-white px-6 py-5 lg:px-8">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  Question{" "}
                  {currentQuestionIndex + 1} of{" "}
                  {questions.length}
                </p>

                <h1 className="mt-1 text-lg font-bold text-slate-900">
                  {isTheoryQuestion
                    ? "Technical & Theory Question"
                    : "Practical Coding Question"}
                </h1>

              </div>

              <div className="rounded-lg bg-blue-50 px-3 py-2">

                {isTheoryQuestion ? (
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-blue-600" />

                    <span className="text-xs font-semibold text-blue-700">
                      Theory
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-blue-600" />

                    <span className="text-xs font-semibold text-blue-700">
                      Coding
                    </span>
                  </div>
                )}

              </div>

            </div>

          </div>

          {/* SCROLLABLE CONTENT */}

          <div className="min-h-0 flex-1 overflow-y-auto p-6 lg:p-8">

            {isTheoryQuestion ? (

              /* ==================================================
                 THEORY QUESTION
              ================================================== */

              <div className="mx-auto max-w-3xl">

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                  <div className="flex items-start gap-4">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                      <Brain className="h-5 w-5 text-blue-600" />
                    </div>

                    <div>

                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Question
                      </p>

                      <h2 className="mt-2 text-xl font-semibold leading-8 text-slate-900">
                        {currentQuestion?.question_text}
                      </h2>

                    </div>

                  </div>

                </div>

                {/* VOICE ANSWER */}

                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                  <div className="flex items-center justify-between">

                    <div>

                      <h3 className="text-sm font-bold text-slate-900">
                        Your Answer
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        Record your answer using
                        your microphone.
                      </p>

                    </div>

                    {isRecording && (
                      <div className="flex items-center gap-2 text-xs font-semibold text-red-500">

                        <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />

                        Recording

                        <span className="font-mono">
                          {formatRecordingTime(
                            recordingTime
                          )}
                        </span>

                      </div>
                    )}

                  </div>

                  {/* RECORDING AREA */}

                  <div className="mt-6 flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50">

                    {isRecording ? (

                      <>
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                          <MicOff className="h-7 w-7 text-red-500" />
                        </div>

                        <p className="mt-4 text-sm font-semibold text-slate-900">
                          Recording your answer
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Speak clearly and explain
                          your answer.
                        </p>

                        <button
                          type="button"
                          onClick={handleRecording}
                          className="mt-5 rounded-lg bg-red-500 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-red-600"
                        >
                          Stop Recording
                        </button>
                      </>

                    ) : answerSubmitted ? (

                      <>
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                          <CheckCircle2 className="h-7 w-7 text-blue-600" />
                        </div>

                        <p className="mt-4 text-sm font-semibold text-slate-900">
                          Answer submitted
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Your answer has been submitted
                          successfully.
                        </p>
                      </>

                    ) : (

                      <>
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                          <Mic className="h-7 w-7 text-blue-600" />
                        </div>

                        <p className="mt-4 text-sm font-semibold text-slate-900">
                          Ready to answer?
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Click below and start speaking.
                        </p>

                        <button
                          type="button"
                          onClick={handleRecording}
                          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                        >
                          <Mic className="h-4 w-4" />
                          Start Recording
                        </button>
                      </>

                    )}

                  </div>

                  {/* RECORDED AUDIO */}

                  {audioUrl &&
                    !isRecording &&
                    !answerSubmitted && (

                      <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">

                        <p className="mb-3 text-xs font-semibold text-slate-600">
                          Recorded Answer
                        </p>

                        <audio
                          controls
                          src={audioUrl}
                          className="w-full"
                        />

                        <button
                          type="button"
                          onClick={handleSubmitAnswer}
                          disabled={
                            isSubmittingAnswer
                          }
                          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >

                          <Send className="h-4 w-4" />

                          {isSubmittingAnswer
                            ? "Submitting..."
                            : "Submit Answer"}

                        </button>

                      </div>

                    )}

                  {/* SUBMITTED STATUS */}

                  {answerSubmitted && (

                    <div className="mt-5 flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">

                      <CheckCircle2 className="h-5 w-5 text-blue-600" />

                      <div>

                        <p className="text-sm font-semibold text-blue-900">
                          Submitted
                        </p>

                        <p className="mt-1 text-xs text-blue-700">
                          This question has already
                          been submitted.
                        </p>

                      </div>

                    </div>

                  )}

                </div>

              </div>

            ) : (

              /* ==================================================
                 CODING QUESTION
              ================================================== */

              <div className="mx-auto max-w-5xl">

                {/* CODING PROBLEM */}

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                  <div className="flex items-start gap-4">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                      <Code2 className="h-5 w-5 text-blue-600" />
                    </div>

                    <div>

                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Coding Problem
                      </p>

                      <h2 className="mt-2 text-xl font-semibold text-slate-900">
                        {currentQuestion.question_text}
                      </h2>

                      <p className="mt-3 text-sm leading-6 text-slate-500">
                        {currentQuestion.skill
                          ? `Practical coding assessment for ${currentQuestion.skill}.`
                          : "Complete the coding problem using the provided starter code."}
                      </p>

                    </div>

                  </div>

                </div>

                {/* CODE EDITOR */}

                <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-sm">

                  <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">

                    <div className="flex items-center gap-2">
                      <Code2 className="h-4 w-4 text-blue-400" />

                      <span className="text-xs font-semibold text-slate-300">
                        {currentQuestion.programming_language ||
                          "Code"}
                      </span>
                    </div>

                    {answerSubmitted && (
                      <span className="text-xs font-semibold text-blue-400">
                        Submitted
                      </span>
                    )}

                  </div>

                  <textarea
                    value={code}
                    onChange={(event) =>
                      setCode(
                        event.target.value
                      )
                    }
                    disabled={
                      isSubmittingAnswer
                    }
                    spellCheck={false}
                    className="min-h-[320px] w-full resize-none bg-slate-950 p-5 font-mono text-sm leading-6 text-slate-200 outline-none disabled:cursor-not-allowed disabled:opacity-70"
                  />

                </div>

                {/* CODING ACTIONS */}

                <div className="mt-5 flex items-center justify-end gap-3">

                  <button
                    type="button"
                    onClick={
                      handleSubmitCodingAnswer
                    }
                    disabled={
                      isSubmittingAnswer ||
                      answerSubmitted
                    }
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                  >
                    {answerSubmitted ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <Send className="h-3.5 w-3.5" />
                    )}

                    {isSubmittingAnswer
                      ? "Submitting..."
                      : answerSubmitted
                        ? "Submitted"
                        : "Submit Code"}

                  </button>

                </div>

                {/* TEST RESULTS */}

                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                  <div className="flex items-center justify-between">

                    <div>

                      <h3 className="text-sm font-bold text-slate-900">
                        Test Results
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        Results returned by the
                        backend execution engine.
                      </p>

                    </div>

                    {testResults.length > 0 && (
                      <span className="text-xs font-semibold text-blue-600">
                        {
                          testResults.filter(
                            (test) =>
                              test.passed
                          ).length
                        }
                        /
                        {testResults.length}{" "}
                        Passed
                      </span>
                    )}

                  </div>

                  {testResults.length === 0 ? (
                    <div className="mt-5 rounded-xl bg-slate-50 p-5 text-center">

                      <p className="text-xs text-slate-500">
                        Submit your code to see
                        the test results.
                      </p>

                    </div>
                  ) : (
                    <div className="mt-5 space-y-3">

                      {testResults.map(
                        (test) => (
                          <div
                            key={test.id}
                            className={`rounded-xl border p-4 ${
                              test.passed
                                ? "border-blue-200 bg-blue-50"
                                : "border-red-200 bg-red-50"
                            }`}
                          >

                            <div className="flex items-start gap-3">

                              {test.passed ? (
                                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                              ) : (
                                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                              )}

                              <div className="min-w-0 flex-1">

                                <div className="flex items-center justify-between">

                                  <p className="text-xs font-semibold text-slate-900">
                                    Test Case{" "}
                                    {test.id}
                                  </p>

                                  <span
                                    className={`text-xs font-bold ${
                                      test.passed
                                        ? "text-blue-700"
                                        : "text-red-700"
                                    }`}
                                  >
                                    {test.passed
                                      ? "Correct"
                                      : "Wrong"}
                                  </span>

                                </div>

                                <div className="mt-3 space-y-2">

                                  <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                      Input
                                    </p>

                                    <pre className="mt-1 overflow-x-auto rounded-lg bg-white/70 p-2 font-mono text-xs text-slate-700">
                                      {test.input ||
                                        "—"}
                                    </pre>
                                  </div>

                                  <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                      Expected Output
                                    </p>

                                    <pre className="mt-1 overflow-x-auto rounded-lg bg-white/70 p-2 font-mono text-xs text-slate-700">
                                      {test.expected ||
                                        "—"}
                                    </pre>
                                  </div>

                                  <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                      Actual Output
                                    </p>

                                    <pre className="mt-1 overflow-x-auto rounded-lg bg-white/70 p-2 font-mono text-xs text-slate-700">
                                      {test.actual ||
                                        "—"}
                                    </pre>
                                  </div>

                                  {test.error && (
                                    <div>

                                      <p className="text-[11px] font-semibold uppercase tracking-wide text-red-500">
                                        Error
                                      </p>

                                      <pre className="mt-1 overflow-x-auto rounded-lg bg-red-100 p-2 font-mono text-xs text-red-700">
                                        {test.error}
                                      </pre>

                                    </div>
                                  )}

                                </div>

                              </div>

                            </div>

                          </div>
                        )
                      )}

                    </div>
                  )}

                </div>

              </div>
            )}

          </div>

          {/* ====================================================
              BOTTOM ACTIONS
          ==================================================== */}

          <div className="shrink-0 border-t border-slate-200 bg-white px-6 py-4 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="h-4 w-4" />
                <span>Interview session is secure</span>
              </div>

              <div className="flex items-center gap-3">
                {!isLastQuestion && (
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    disabled={isSubmittingAnswer || isRecording}
                    className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-5 py-2.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {answerSubmitted
                      ? "Next Question"
                      : "Skip & Next Question"}

                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}

                {isLastQuestion && (
                  <button
                    type="button"
                    onClick={handleSubmitInterview}
                    disabled={isSubmittingAnswer || isRecording}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {answerSubmitted
                      ? "Complete Interview"
                      : "Skip & Complete"}

                    <CheckCircle2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ====================================================
              COMPLETE INTERVIEW CONFIRMATION MODAL
          ==================================================== */}

          {showCompleteConfirmModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                  <CheckCircle2 className="h-6 w-6 text-blue-600" />
                </div>

                <h2 className="mt-5 text-xl font-bold text-slate-900">
                  Complete Interview?
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  You have reached the end of the interview. Are you sure you want to complete your interview?
                </p>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCompleteConfirmModal(false)}
                    className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirmCompleteInterview}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Complete Interview
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================
              INTERVIEW COMPLETED MODAL
          ==================================================== */}

          {showCompletedModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
              <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-8 text-center shadow-2xl">
                <div className="pointer-events-none absolute left-8 top-6 text-2xl">🎉</div>
                <div className="pointer-events-none absolute right-8 top-10 text-xl">✨</div>
                <div className="pointer-events-none absolute bottom-20 left-10 text-xl">🎊</div>
                <div className="pointer-events-none absolute bottom-16 right-10 text-2xl">✨</div>

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
                  <CheckCircle2 className="h-10 w-10 text-blue-600" />
                </div>

                <h2 className="mt-6 text-2xl font-bold text-slate-900">
                  🎉 Interview Completed!
                </h2>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
                  Congratulations! You have successfully completed your AI interview.
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  Your responses have been submitted successfully.
                </p>

                <button
                  type="button"
                  onClick={handleGoToApplications}
                  className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Go to Applications
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

        </section>

      </main>

    </div>
  );
};

export default AIInterviewSession;