import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { startAIInterview } from "../../../services/candidate/candidateJobApplicationService";

import {
  Clock3,
  Brain,
  Code2,
  Mic,
  Camera,
  Wifi,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const AIInterviewPage = () => {
  const navigate = useNavigate();
  const { interviewId } = useParams();
const handleBeginInterview = async () => {
  try {
    console.log("Starting interview:", interviewId);

    const response = await startAIInterview(interviewId);

    console.log("Start interview response:", response);

    navigate(`/candidate/interviews/${interviewId}/session`);
  } catch (error) {
    console.log("FULL ERROR:", error);
    console.log("STATUS:", error?.response?.status);
    console.log("DATA:", error?.response?.data);

    alert(
      JSON.stringify(
        error?.response?.data || {
          message: error?.message,
        },
        null,
        2
      )
    );
  }
};

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-6xl">

        {/* Brand */}
        <div className="mb-10 flex items-center justify-center">
          <div className="text-2xl font-extrabold tracking-tight text-slate-900">
            Hire<span className="text-blue-600">Flow</span>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-600">
            HireFlow AI Interview
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            AI Technical Interview
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Before you begin, make sure you understand the interview format
            and your device is ready.
          </p>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Interview Information */}
          <div className="border-b border-slate-100 p-8 lg:p-10">

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Before you begin
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  This interview includes technical questions and practical
                  coding challenges.
                </p>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {/* Duration */}
              <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-5 transition hover:shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <Clock3 className="h-5 w-5 text-blue-600" />
                </div>

                <p className="mt-4 text-sm font-semibold text-slate-900">
                  Duration
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  30 minutes
                </p>
              </div>

              {/* Theory */}
              <div className="rounded-xl border border-violet-100 bg-violet-50/60 p-5 transition hover:shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100">
                  <Brain className="h-5 w-5 text-violet-600" />
                </div>

                <p className="mt-4 text-sm font-semibold text-slate-900">
                  Theory & Technical
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Voice-based answers
                </p>
              </div>

              {/* Coding */}
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-5 transition hover:shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                  <Code2 className="h-5 w-5 text-emerald-600" />
                </div>

                <p className="mt-4 text-sm font-semibold text-slate-900">
                  Practical Coding
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Code & test cases
                </p>
              </div>

              {/* AI Evaluation */}
              <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-5 transition hover:shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                  <ShieldCheck className="h-5 w-5 text-amber-600" />
                </div>

                <p className="mt-4 text-sm font-semibold text-slate-900">
                  AI Evaluation
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Automatic assessment
                </p>
              </div>
            </div>
          </div>

          {/* System Check */}
          <div className="p-8 lg:p-10">

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                System check
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Make sure everything is ready before starting your interview.
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">

              {/* Camera */}
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                  <Camera className="h-5 w-5 text-blue-600" />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">
                    Camera
                  </p>

                  <p className="text-xs text-slate-500">
                    Ready
                  </p>
                </div>

                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>

              {/* Microphone */}
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50">
                  <Mic className="h-5 w-5 text-violet-600" />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">
                    Microphone
                  </p>

                  <p className="text-xs text-slate-500">
                    Ready
                  </p>
                </div>

                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>

              {/* Internet */}
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                  <Wifi className="h-5 w-5 text-emerald-600" />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">
                    Internet
                  </p>

                  <p className="text-xs text-slate-500">
                    Connected
                  </p>
                </div>

                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>
            </div>

            {/* Important Information */}
            <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                  <ShieldCheck className="h-5 w-5 text-amber-600" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-amber-900">
                    Important Information
                  </h3>

                  <ul className="mt-3 space-y-2.5 text-sm text-amber-800">
                    <li className="flex gap-2">
                      <span className="mt-0.5">•</span>
                      <span>
                        Your 30-minute interview timer starts when you click
                        Begin Interview.
                      </span>
                    </li>

                    <li className="flex gap-2">
                      <span className="mt-0.5">•</span>
                      <span>
                        Theory and technical questions require voice-based
                        answers.
                      </span>
                    </li>

                    <li className="flex gap-2">
                      <span className="mt-0.5">•</span>
                      <span>
                        Practical questions include a coding environment and
                        test cases.
                      </span>
                    </li>

                    <li className="flex gap-2">
                      <span className="mt-0.5">•</span>
                      <span>
                        Once the interview begins, the session cannot be
                        restarted.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Begin Interview */}
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={handleBeginInterview}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Begin Interview
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="h-4 w-4" />

          <span>
            Your interview session is securely managed by{" "}
            <span className="font-semibold text-slate-500">
              HireFlow
            </span>
            .
          </span>
        </div>
      </div>
    </div>
  );
};

export default AIInterviewPage;