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
} from "../../../services/candidate/aiInterviewService";

const AIInterviewSession = () => {
  const navigate = useNavigate();
  const { interviewId } = useParams();

  // ============================================================
  // INTERVIEW TIMER
  // ============================================================

  const [timeLeft, setTimeLeft] = useState(30 * 60);

  // ============================================================
  // QUESTIONS
  // ============================================================

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [questionsError, setQuestionsError] = useState("");

  // ============================================================
  // THEORY AUDIO
  // ============================================================

  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // ============================================================
  // CODING
  // ============================================================

  const [code, setCode] = useState("");
  const [testResults, setTestResults] = useState([]);

  // ============================================================
  // SUBMISSION
  // ============================================================

  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);

  // ============================================================
  // CURRENT QUESTION
  // ============================================================

  const currentQuestion = questions[currentQuestionIndex];

  const isTheoryQuestion =
    currentQuestion?.question_type === "THEORY";

  const isCodingQuestion =
    currentQuestion?.question_type === "CODING";

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
          "FAILED TO LOAD QUESTIONS:",
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
  // RESET CURRENT QUESTION
  // ============================================================

  useEffect(() => {
    if (!currentQuestion) {
      return;
    }

    // Stop any active recording
    if (
      mediaRecorderRef.current &&
      isRecording
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }

    // Cleanup previous audio
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    setAudioBlob(null);
    setAudioUrl(null);

    setRecordingTime(0);

    setTestResults([]);

    setAnswerSubmitted(false);

    setIsSubmittingAnswer(false);

    audioChunksRef.current = [];

    // Coding starter code
    if (
      currentQuestion.question_type === "CODING"
    ) {
      setCode(
        currentQuestion.starter_code || ""
      );
    } else {
      setCode("");
    }
  }, [currentQuestionIndex, questions]);

  // ============================================================
  // RECORDING TIMER
  // ============================================================

  useEffect(() => {
    if (!isRecording) {
      return;
    }

    const interval = setInterval(() => {
      setRecordingTime(
        (previous) => previous + 1
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [isRecording]);

  // ============================================================
  // CLEANUP AUDIO
  // ============================================================

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }

      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [audioUrl]);

  // ============================================================
  // FORMAT TIME
  // ============================================================

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(remainingSeconds).padStart(
      2,
      "0"
    )}`;
  };

  const formatRecordingTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(remainingSeconds).padStart(
      2,
      "0"
    )}`;
  };

  // ============================================================
  // START / STOP RECORDING
  // ============================================================

  const handleRecording = async () => {
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
    // START NEW RECORDING
    // ----------------------------------------------------------

    try {
      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            audio: true,
          }
        );

      const mimeType =
        MediaRecorder.isTypeSupported(
          "audio/webm"
        )
          ? "audio/webm"
          : "audio/ogg";

      const mediaRecorder =
        new MediaRecorder(stream, {
          mimeType,
        });

      mediaRecorderRef.current =
        mediaRecorder;

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (
        event
      ) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(
            event.data
          );
        }
      };

      mediaRecorder.onstop = () => {
        const recordedBlob = new Blob(
          audioChunksRef.current,
          {
            type: mimeType,
          }
        );

        const url =
          URL.createObjectURL(
            recordedBlob
          );

        setAudioBlob(recordedBlob);
        setAudioUrl(url);

        stream
          .getTracks()
          .forEach((track) =>
            track.stop()
          );

        console.log(
          "AUDIO BLOB CREATED:",
          recordedBlob
        );
      };

      // --------------------------------------------------------
      // IMPORTANT:
      // New recording means candidate wants to replace
      // previous submitted answer.
      // --------------------------------------------------------

      setAnswerSubmitted(false);

      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }

      setAudioBlob(null);
      setAudioUrl(null);

      audioChunksRef.current = [];

      setRecordingTime(0);

      mediaRecorder.start();

      setIsRecording(true);

      console.log(
        "RECORDING STARTED"
      );
    } catch (error) {
      console.error(
        "MICROPHONE ACCESS FAILED:",
        error
      );

      alert(
        "Microphone permission is required to record your answer."
      );
    }
  };

  // ============================================================
  // SUBMIT THEORY ANSWER
  // ============================================================

  const handleSubmitAnswer = async () => {
    if (!currentQuestion) {
      alert("Current question not found.");
      return;
    }

    if (!isTheoryQuestion) {
      return;
    }

    if (isSubmittingAnswer) {
      return;
    }

    if (!audioBlob) {
      alert(
        "Please record your answer before submitting."
      );
      return;
    }

    try {
      setIsSubmittingAnswer(true);

      console.log(
        "SUBMITTING THEORY ANSWER"
      );

      console.log(
        "QUESTION ID:",
        currentQuestion.id
      );

      console.log(
        "AUDIO:",
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

      // --------------------------------------------------------
      // IMPORTANT:
      // Submitted state is only UI state.
      // Candidate can still record again.
      // --------------------------------------------------------

      setAnswerSubmitted(true);

      alert(
        "Answer submitted successfully."
      );
    } catch (error) {
      console.error(
        "FAILED VOICE ANSWER:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to submit your answer."
      );
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  // ============================================================
  // RECORD AGAIN
  // ============================================================

  const handleRecordAgain = () => {
    // Clear previous recording.
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    setAudioBlob(null);
    setAudioUrl(null);

    setRecordingTime(0);

    // Allow a new submission.
    setAnswerSubmitted(false);

    audioChunksRef.current = [];

    console.log(
      "READY FOR NEW THEORY RECORDING"
    );
  };

  // ============================================================
  // SUBMIT CODING ANSWER
  // ============================================================

  const handleSubmitCodingAnswer = async () => {
    if (!currentQuestion) {
      alert("Current question not found.");
      return;
    }

    if (!isCodingQuestion) {
      return;
    }

    if (isSubmittingAnswer) {
      return;
    }

    if (!code.trim()) {
      alert(
        "Please write your code before submitting."
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
        "LANGUAGE:",
        currentQuestion.programming_language
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
        "CODING ANSWER RESPONSE:",
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

            input:
              result.input ?? "",

            expected:
              result.expected_output ??
              "",

            actual:
              result.actual_output ??
              "",

            passed:
              result.passed === true,

            error:
              result.error ?? "",
          })
        );

      setTestResults(
        formattedResults
      );

      // --------------------------------------------------------
      // SUBMITTED STATE
      // --------------------------------------------------------

      setAnswerSubmitted(true);

      console.log(
        "CODING ANSWER SUBMITTED SUCCESSFULLY"
      );
    } catch (error) {
      console.error(
        "FAILED CODING ANSWER:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to submit coding answer."
      );
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  // ============================================================
  // EDIT / RESUBMIT CODING
  // ============================================================

  const handleEditCodingAnswer = () => {
    // Keep the current code.
    // Candidate can modify it.

    setAnswerSubmitted(false);

    console.log(
      "CODING ANSWER UNLOCKED FOR RESUBMISSION"
    );
  };

  // ============================================================
  // NEXT QUESTION
  // ============================================================

  const handleNextQuestion = () => {
    // Stop recording
    if (
      mediaRecorderRef.current &&
      isRecording
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }

    // Cleanup audio
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
        (previous) =>
          previous + 1
      );
    }
  };

  // ============================================================
  // SUBMIT INTERVIEW
  // ============================================================

  const handleSubmitInterview = () => {
    navigate(
      "/candidate/applications"
    );
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
            Preparing your AI technical
            interview.
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
            Unable to load interview
            questions
          </p>

          <p className="mt-2 text-sm text-slate-400">
            {questionsError}
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // NO QUESTIONS
  // ============================================================

  if (!currentQuestion) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="text-center">
          <p className="text-lg font-semibold">
            No interview questions found.
          </p>

          <p className="mt-2 text-sm text-slate-400">
            Please try opening the interview
            again.
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="h-screen overflow-hidden bg-slate-950 text-white">

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
          MAIN
      ====================================================== */}

      <main className="flex h-[calc(100vh-64px)] min-h-0 flex-col overflow-hidden lg:flex-row">

        {/* ====================================================
            LEFT AI INTERVIEWER
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
                Listen carefully to the
                question and provide your
                answer when you are ready.
              </p>

            </div>

          </div>

        </section>

        {/* ====================================================
            RIGHT CONTENT
        ==================================================== */}

        <section className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-slate-50 text-slate-900 lg:w-[60%]">

          {/* QUESTION HEADER */}

          <div className="shrink-0 border-b border-slate-200 bg-white px-6 py-5 lg:px-8">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  Question{" "}
                  {currentQuestionIndex + 1}{" "}
                  of{" "}
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

          {/* ==================================================
              SCROLLABLE CONTENT
          ================================================== */}

          <div className="min-h-0 flex-1 overflow-y-auto p-6 lg:p-8">

            {/* ==================================================
                THEORY
            ================================================== */}

            {isTheoryQuestion ? (

              <div className="mx-auto max-w-3xl">

                {/* QUESTION */}

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
                        {
                          currentQuestion.question_text
                        }
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
                        Record your answer
                        using your microphone.
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
                          Speak clearly and
                          explain your answer.
                        </p>

                        <button
                          type="button"
                          onClick={
                            handleRecording
                          }
                          className="mt-5 rounded-lg bg-red-500 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-red-600"
                        >
                          Stop Recording
                        </button>
                      </>

                    ) : (

                      <>
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">

                          <Mic className="h-7 w-7 text-blue-600" />

                        </div>

                        <p className="mt-4 text-sm font-semibold text-slate-900">

                          {answerSubmitted
                            ? "Record another answer?"
                            : "Ready to answer?"}

                        </p>

                        <p className="mt-1 text-xs text-slate-500">

                          {answerSubmitted
                            ? "You can replace your previous answer."
                            : "Click below and start speaking."}

                        </p>

                        <button
                          type="button"
                          onClick={
                            answerSubmitted
                              ? handleRecordAgain
                              : handleRecording
                          }
                          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                        >

                          <Mic className="h-4 w-4" />

                          {answerSubmitted
                            ? "Record Again"
                            : "Start Recording"}

                        </button>

                      </>

                    )}

                  </div>

                  {/* RECORDED AUDIO */}

                  {audioUrl &&
                    !isRecording && (
                      <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">

                        <p className="mb-3 text-xs font-semibold text-slate-600">
                          Recorded Answer
                        </p>

                        <audio
                          controls
                          src={audioUrl}
                          className="w-full"
                        />

                        {/* SUBMIT */}

                        {!answerSubmitted && (
                          <button
                            type="button"
                            onClick={
                              handleSubmitAnswer
                            }
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
                        )}

                      </div>
                    )}

                  {/* SUBMITTED STATUS */}

                  {answerSubmitted && (
                    <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4">

                      <div className="flex items-start gap-3">

                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                        <div className="flex-1">

                          <p className="text-sm font-semibold text-blue-900">
                            Submitted
                          </p>

                          <p className="mt-1 text-xs text-blue-700">
                            Your latest answer has
                            been submitted
                            successfully.
                          </p>

                        </div>

                      </div>

                    </div>
                  )}

                </div>

              </div>

            ) : (

              /* ==================================================
                 CODING
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
                        {
                          currentQuestion.question_text
                        }
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
                        {
                          currentQuestion.programming_language ||
                          "Code"
                        }
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

                  {answerSubmitted && (
                    <button
                      type="button"
                      onClick={
                        handleEditCodingAnswer
                      }
                      disabled={
                        isSubmittingAnswer
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-5 py-2.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Edit & Resubmit
                    </button>
                  )}

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
                        Results returned by
                        the backend execution
                        engine.
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

                        {
                          testResults.length
                        }

                        {" "}Passed

                      </span>

                    )}

                  </div>

                  {testResults.length === 0 ? (

                    <div className="mt-5 rounded-xl bg-slate-50 p-5 text-center">

                      <p className="text-xs text-slate-500">
                        Submit your code to
                        see the test results.
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

                                  {/* INPUT */}

                                  <div>

                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                      Input
                                    </p>

                                    <pre className="mt-1 overflow-x-auto rounded-lg bg-white/70 p-2 font-mono text-xs text-slate-700">
                                      {test.input ||
                                        "—"}
                                    </pre>

                                  </div>

                                  {/* EXPECTED */}

                                  <div>

                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                      Expected Output
                                    </p>

                                    <pre className="mt-1 overflow-x-auto rounded-lg bg-white/70 p-2 font-mono text-xs text-slate-700">
                                      {test.expected ||
                                        "—"}
                                    </pre>

                                  </div>

                                  {/* ACTUAL */}

                                  <div>

                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                      Actual Output
                                    </p>

                                    <pre className="mt-1 overflow-x-auto rounded-lg bg-white/70 p-2 font-mono text-xs text-slate-700">
                                      {test.actual ||
                                        "—"}
                                    </pre>

                                  </div>

                                  {/* ERROR */}

                                  {test.error && (
                                    <div>

                                      <p className="text-[11px] font-semibold uppercase tracking-wide text-red-500">
                                        Error
                                      </p>

                                      <pre className="mt-1 overflow-x-auto rounded-lg bg-red-100 p-2 font-mono text-xs text-red-700">
                                        {
                                          test.error
                                        }
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

                <span>
                  Interview session is secure
                </span>

              </div>

              <div className="flex items-center gap-3">

                {currentQuestionIndex <
                  questions.length - 1 && (

                  <button
                    type="button"
                    onClick={
                      handleNextQuestion
                    }
                    className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-5 py-2.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
                  >
                    Skip & Next Question

                    <ChevronRight className="h-4 w-4" />

                  </button>

                )}

                {currentQuestionIndex ===
                  questions.length - 1 && (

                  <button
                    type="button"
                    onClick={
                      handleSubmitInterview
                    }
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                  >

                    <Send className="h-4 w-4" />

                    Submit Interview

                  </button>

                )}

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
};

export default AIInterviewSession;