import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Brain,
  Clock3,
  Mic,
  MicOff,
  Code2,
  Play,
  Send,
  CheckCircle2,
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

  const [answer, setAnswer] = useState("");

  const [code, setCode] = useState(
    `def find_largest(numbers):
    # Write your solution here
    pass`,
  );

  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  // ============================================================
  // ANSWER SUBMISSION STATE
  // ============================================================

  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);

  // ============================================================
  // CURRENT QUESTION
  // ============================================================

  const currentQuestion = questions[currentQuestionIndex];

  const isTheoryQuestion = currentQuestion?.question_type === "THEORY";

  const isCodingQuestion = currentQuestion?.question_type === "CODING";

  // ============================================================
  // 30-MINUTE INTERVIEW TIMER
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
  // FETCH INTERVIEW QUESTIONS
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
        console.error("Failed to load interview questions:", error);

        setQuestionsError(
          error.response?.data?.message ||
            "Failed to load interview questions.",
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
  // SYNC CODE WITH CURRENT QUESTION
  // ============================================================

  useEffect(() => {
    if (!currentQuestion) {
      setCode("");
      setTestResults([]);
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
      remainingSeconds,
    ).padStart(2, "0")}`;
  };

  // ============================================================
  // FORMAT RECORDING TIME
  // ============================================================

  const formatRecordingTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds,
    ).padStart(2, "0")}`;
  };

  // ============================================================
  // RECORDING
  // ============================================================

  const handleRecording = async () => {
    // ==========================================================
    // STOP RECORDING
    // ==========================================================

    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }


      setIsRecording(false);
      return;
    }

    // ==========================================================
    // START RECORDING
    // ==========================================================

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      // ========================================================
      // MEDIA RECORDER
      // ========================================================

      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
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
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mimeType,
        });

        setAudioBlob(audioBlob);

        const url = URL.createObjectURL(audioBlob);

        setAudioUrl(url);

        stream.getTracks().forEach((track) => {
          track.stop();
        });

        console.log("AUDIO BLOB CREATED:", audioBlob);
      };

      mediaRecorder.start();

      setRecordingTime(0);
      setAudioUrl(null);
      setAudioBlob(null);
      setAnswerSubmitted(false);
      setIsRecording(true);
    } catch (error) {
      console.error("Microphone access failed:", error);

      alert(
        "Microphone permission is required to record your answer.",
      );
    }
  };

  // ============================================================
  // RUN CODE
  // ============================================================

  const handleRunCode = () => {
    setIsRunning(true);

    setTimeout(() => {
      setIsRunning(false);

      setTestResults([
        {
          id: 1,
          input: "[3, 7, 2, 9, 4]",
          expected: "9",
          status: "passed",
        },
        {
          id: 2,
          input: "[10, 5, 8, 1]",
          expected: "10",
          status: "passed",
        },
      ]);
    }, 1000);
  };

  // ============================================================
  // SUBMIT THEORY ANSWER
  // ============================================================

  const handleSubmitAnswer = async () => {
    if (!currentQuestion) {
      alert("Current question not found.");
      return;
    }

    if (currentQuestion.question_type !== "THEORY") {
      return;
    }

    if (answerSubmitted || isSubmittingAnswer) {
      return;
    }

    if (!audioBlob) {
      alert("Please record your answer before submitting.");
      return;
    }

    const answerText = "Audio answer submitted.";

    try {
      setIsSubmittingAnswer(true);

      console.log("ANSWER TEXT:", answerText);
      console.log("SUBMITTING AUDIO BLOB:", audioBlob);

      const data = await submitAIInterviewVoiceAnswer(
        currentQuestion.id,
        audioBlob,
        answerText,
      );

      console.log("VOICE ANSWER SUBMITTED:", data);

      setAnswerSubmitted(true);

      alert("Answer submitted successfully.");
    } catch (error) {
      console.error(
        "FAILED VOICE ANSWER STATUS:",
        error.response?.status,
      );

      console.error(
        "FAILED VOICE ANSWER DATA:",
        error.response?.data,
      );

      console.error(
        "FAILED VOICE ANSWER ERROR:",
        error,
      );

      alert(
        error.response?.data?.message ||
          "Failed to submit your answer.",
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
      alert("Current question not found.");
      return;
    }

    if (currentQuestion.question_type !== "CODING") {
      return;
    }

    if (answerSubmitted || isSubmittingAnswer) {
      return;
    }

    if (!code.trim()) {
      alert("Please write your code before submitting.");
      return;
    }

    try {
      setIsSubmittingAnswer(true);

      console.log("SUBMITTING CODING ANSWER");
      console.log("QUESTION ID:", currentQuestion.id);
      console.log("CODE:", code);

      const data = await submitAIInterviewCodingAnswer(
        currentQuestion.id,
        code,
      );

      console.log("CODING ANSWER SUBMITTED:", data);

      if (data?.answer?.test_results) {
        setTestResults(
          data.answer.test_results.map((result, index) => ({
            id: index + 1,
            input: result.input,
            expected: result.expected_output,
            actual: result.actual_output,
            status: result.passed ? "passed" : "failed",
            error: result.error || "",
          })),
        );
      }

      setAnswerSubmitted(true);

      alert("Coding answer submitted successfully.");
    } catch (error) {
      console.error(
        "FAILED CODING ANSWER STATUS:",
        error.response?.status,
      );

      console.error(
        "FAILED CODING ANSWER DATA:",
        error.response?.data,
      );

      console.error(
        "FAILED CODING ANSWER ERROR:",
        error,
      );

      alert(
        error.response?.data?.message ||
          "Failed to submit coding answer.",
      );
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  // ============================================================
  // NEXT QUESTION
  // ============================================================

  const handleNextQuestion = () => {
    // Stop recording if still active
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }


    setAnswer("");
    setTestResults([]);
    setRecordingTime(0);
    setAudioBlob(null);
    setAnswerSubmitted(false);
    setIsSubmittingAnswer(false);

    // Clear previous audio
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }

    audioChunksRef.current = [];

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(
        (previous) => previous + 1,
      );
    }
  };

  // ============================================================
  // SUBMIT INTERVIEW
  // ============================================================

  const handleSubmitInterview = () => {
    navigate(`/candidate/applications`);
  };

  // ============================================================
  // CURRENT QUESTION
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
      {/* ========================================================
          TOP BAR
      ======================================================== */}

      <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-950 px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="text-2xl font-extrabold tracking-tight">
            Hire<span className="text-blue-500">Flow</span>
          </div>

          <div className="hidden h-5 w-px bg-slate-700 sm:block" />

          <span className="hidden text-sm font-medium text-slate-400 sm:block">
            AI Technical Interview
          </span>
        </div>

        {/* Interview Status */}
        <div className="flex items-center gap-5">
          {/* Live */}
          <div className="hidden items-center gap-2 sm:flex">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />

              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>

            <span className="text-xs font-semibold text-emerald-400">
              LIVE
            </span>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2">
            <Clock3 className="h-4 w-4 text-blue-400" />

            <span className="font-mono text-sm font-semibold tracking-wide">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </header>

      {/* ========================================================
          MAIN WORKSPACE
      ======================================================== */}

      <main className="flex h-[calc(100vh-64px)] min-h-0 flex-col overflow-hidden lg:flex-row">
        {/* ======================================================
            LEFT - AI INTERVIEWER
        ====================================================== */}

        <section className="flex h-full w-full shrink-0 flex-col overflow-hidden border-b border-slate-800 bg-slate-900 p-6 lg:w-[40%] lg:border-b-0 lg:border-r">
          {/* Interviewer Header */}
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

          {/* AI Avatar */}
          <AIInterviewer
            question={currentQuestion?.question_text || ""}
          />

          {/* AI Message */}
          <div className="mt-5 shrink-0 rounded-xl border border-slate-800 bg-slate-950 p-4">
            <div className="flex gap-3">
              <div className="mt-0.5">
                <CircleDot className="h-4 w-4 text-blue-400" />
              </div>

              <p className="text-sm leading-6 text-slate-400">
                Listen carefully to the question and provide your
                answer when you are ready.
              </p>
            </div>
          </div>
        </section>

        {/* ======================================================
            RIGHT - INTERVIEW CONTENT
        ====================================================== */}

        <section className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-slate-50 text-slate-900 lg:w-[60%]">
          {/* QUESTION HEADER */}

          <div className="shrink-0 border-b border-slate-200 bg-white px-6 py-5 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  Question {currentQuestionIndex + 1} of{" "}
                  {questions.length}
                </p>

                <h1 className="mt-1 text-lg font-bold text-slate-900">
                  {isTheoryQuestion
                    ? "Technical & Theory Question"
                    : "Practical Coding Question"}
                </h1>
              </div>

              <div className="rounded-lg bg-slate-100 px-3 py-2">
                {isTheoryQuestion ? (
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-violet-600" />

                    <span className="text-xs font-semibold text-slate-600">
                      Theory
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-emerald-600" />

                    <span className="text-xs font-semibold text-slate-600">
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
                {/* Question */}
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

                {/* Voice Answer */}
                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Your Answer
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        Answer using your microphone. Your recording will
                        be submitted securely.
                      </p>
                    </div>

                    {isRecording && (
                      <div className="flex items-center gap-2 text-xs font-semibold text-red-500">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />

                        Recording

                        <span className="font-mono">
                          {formatRecordingTime(recordingTime)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Recording Area */}
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
                          Speak clearly and explain your answer.
                        </p>

                        <button
                          type="button"
                          onClick={handleRecording}
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

                  {/* Recorded Audio */}
                  {audioUrl && !isRecording && (
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
                        className="mt-4 w-full rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                      >
                        Submit Answer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* ==================================================
                 CODING QUESTION
              ================================================== */

              <div className="mx-auto max-w-5xl">
                {/* Coding Problem */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                      <Code2 className="h-5 w-5 text-emerald-600" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Coding Problem
                      </p>

                      <h2 className="mt-2 text-xl font-semibold text-slate-900">
                        {currentQuestion?.question_text}
                      </h2>

                      <p className="mt-3 text-sm leading-6 text-slate-500">
                        {currentQuestion?.skill
                          ? `Practical coding assessment for ${currentQuestion.skill}.`
                          : "Complete the coding problem using the provided starter code."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Code Editor */}
                <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Code2 className="h-4 w-4 text-emerald-400" />

                      <span className="text-xs font-semibold text-slate-300">
                        {currentQuestion?.programming_language ||
                          "Code"}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleRunCode}
                      disabled={isRunning}
                      className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Play className="h-3.5 w-3.5" />

                      {isRunning ? "Running..." : "Run Code"}
                    </button>
                  </div>

                  <textarea
                    value={code}
                    onChange={(event) =>
                      setCode(event.target.value)
                    }
                    spellCheck={false}
                    className="min-h-[280px] w-full resize-none bg-slate-950 p-5 font-mono text-sm leading-6 text-slate-200 outline-none"
                  />
                </div>

                {/* Coding Submit */}
                <div className="mt-5 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSubmitCodingAnswer}
                    disabled={answerSubmitted || isSubmittingAnswer}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Send className="h-3.5 w-3.5" />

                    {isSubmittingAnswer
                      ? "Submitting..."
                      : answerSubmitted
                        ? "Submitted"
                        : "Submit Answer"}
                  </button>
                </div>

                {/* Test Cases */}
                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Test Cases
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        Run your code to check the test cases.
                      </p>
                    </div>

                    {testResults.length > 0 && (
                      <span className="text-xs font-semibold text-emerald-600">
                        {testResults.length}/
                        {testResults.length} Passed
                      </span>
                    )}
                  </div>

                  {testResults.length === 0 ? (
                    <div className="mt-5 rounded-xl bg-slate-50 p-5 text-center">
                      <p className="text-xs text-slate-500">
                        No test results yet. Run your code to see
                        the results.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-5 space-y-3">
                      {testResults.map((test) => (
                        <div
                          key={test.id}
                          className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4"
                        >
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />

                          <div className="flex-1">
                            <p className="text-xs font-semibold text-slate-900">
                              Test Case {test.id}
                            </p>

                            <p className="mt-1 font-mono text-xs text-slate-500">
                              Input: {test.input}
                            </p>

                            <p className="mt-1 font-mono text-xs text-slate-500">
                              Expected: {test.expected}
                            </p>
                          </div>

                          <span className="text-xs font-bold text-emerald-600">
                            Passed
                          </span>
                        </div>
                      ))}
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
                {currentQuestionIndex < questions.length - 1 && (
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                  >
                    Skip & Next Question
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}

                {currentQuestionIndex === questions.length - 1 && (
                  <button
                    type="button"
                    onClick={handleSubmitInterview}
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