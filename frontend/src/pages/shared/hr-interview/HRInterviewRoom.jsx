
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
    Room,
    RoomEvent,
    Track,
} from "livekit-client";

import { toast } from "sonner";

import {
    getCandidateHRInterviewToken,
} from "../../../services/candidate/candidateHRInterviewService";

import {
    getCompanyHRInterviewToken,
} from "../../../services/company/hrInterviewService";


function VideoTile({ mediaTrack }) {
    const videoRef = useRef(null);

    useEffect(() => {
        const element = videoRef.current;

        if (!element || !mediaTrack.track) return;

        mediaTrack.track.attach(element);

        return () => {
            mediaTrack.track.detach(element);
        };
    }, [mediaTrack.track]);

    return (
        <div className="relative flex min-h-[240px] items-center justify-center overflow-hidden rounded-xl bg-gray-900">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={mediaTrack.isLocal}
                className="h-full w-full object-cover"
            />

            <div className="absolute bottom-3 left-3 rounded-md bg-black/60 px-3 py-1 text-sm text-white">
                {mediaTrack.name}
                {mediaTrack.isLocal ? " (You)" : ""}
            </div>
        </div>
    );
}


function AudioOutput({ track }) {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current || !track) return;

        const audioElement = track.attach();

        audioElement.autoplay = true;
        audioElement.style.display = "none";

        containerRef.current.appendChild(audioElement);

        return () => {
            track.detach(audioElement);
            audioElement.remove();
        };
    }, [track]);

    return <div ref={containerRef} />;
}


function HRInterviewRoom() {
    const { interviewId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const roomRef = useRef(null);

    const isCompany = location.pathname.startsWith("/company/");

    const [loading, setLoading] = useState(true);
    const [connecting, setConnecting] = useState(false);
    const [error, setError] = useState("");
    const [roomConnected, setRoomConnected] = useState(false);

    const [mediaTracks, setMediaTracks] = useState([]);
    const [microphoneEnabled, setMicrophoneEnabled] = useState(true);
    const [cameraEnabled, setCameraEnabled] = useState(true);

    const syncTracks = useCallback((room) => {
        if (!room) return;

        const tracks = [];

        const addParticipantTracks = (participant, isLocal) => {
            participant.trackPublications.forEach((publication) => {
                const track = publication.track;

                if (!track) return;

                if (track.kind === Track.Kind.Video) {
                    tracks.push({
                        id: `${participant.identity}-${publication.trackSid}`,
                        track,
                        identity: participant.identity,
                        name: participant.name || participant.identity,
                        isLocal,
                    });
                }
            });
        };

        addParticipantTracks(room.localParticipant, true);

        room.remoteParticipants.forEach((participant) => {
            addParticipantTracks(participant, false);
        });

        setMediaTracks(tracks);
    }, []);

    useEffect(() => {
        let active = true;

        const connectToRoom = async () => {
            let room;

            try {
                if (!interviewId) {
                    throw new Error("Invalid HR interview ID.");
                }

                setLoading(true);
                setError("");

                const tokenData = isCompany
                    ? await getCompanyHRInterviewToken(interviewId)
                    : await getCandidateHRInterviewToken(interviewId);

                if (!active) return;

                if (!tokenData?.token || !tokenData?.url) {
                    throw new Error("Invalid LiveKit connection details.");
                }

                room = new Room({
                    adaptiveStream: true,
                    dynacast: true,
                });

                roomRef.current = room;

                room.on(RoomEvent.TrackSubscribed, () => {
                    syncTracks(room);
                });

                room.on(RoomEvent.TrackUnsubscribed, () => {
                    syncTracks(room);
                });

                room.on(RoomEvent.ParticipantConnected, () => {
                    syncTracks(room);
                });

                room.on(RoomEvent.ParticipantDisconnected, () => {
                    syncTracks(room);
                });

                room.on(RoomEvent.LocalTrackPublished, () => {
                    syncTracks(room);
                });

                room.on(RoomEvent.LocalTrackUnpublished, () => {
                    syncTracks(room);
                });

                room.on(RoomEvent.Disconnected, () => {
                    if (active) {
                        setRoomConnected(false);
                    }
                });

                setConnecting(true);

                await room.connect(tokenData.url, tokenData.token);

                if (!active) {
                    room.disconnect();
                    return;
                }

                setRoomConnected(true);

                await room.localParticipant.setMicrophoneEnabled(true);

                if (!active) return;

                await room.localParticipant.setCameraEnabled(true);

                if (!active) return;

                setMicrophoneEnabled(
                    room.localParticipant.isMicrophoneEnabled
                );

                setCameraEnabled(
                    room.localParticipant.isCameraEnabled
                );

                syncTracks(room);
            } catch (err) {
                console.error("HR Interview connection failed:", err);

                if (active) {
                    setError(
                        err?.response?.data?.detail ||
                        err?.response?.data?.message ||
                        err?.message ||
                        "Unable to connect to the HR interview."
                    );

                    setRoomConnected(false);
                }

                room?.disconnect();

                if (roomRef.current === room) {
                    roomRef.current = null;
                }
            } finally {
                if (active) {
                    setLoading(false);
                    setConnecting(false);
                }
            }
        };

        connectToRoom();

        return () => {
            active = false;

            if (roomRef.current) {
                roomRef.current.disconnect();
                roomRef.current = null;
            }
        };
    }, [interviewId, isCompany, syncTracks]);

    const toggleMicrophone = async () => {
        const room = roomRef.current;

        if (!room || !roomConnected) return;

        try {
            const nextState = !microphoneEnabled;

            await room.localParticipant.setMicrophoneEnabled(nextState);

            setMicrophoneEnabled(nextState);
} catch (err) {
    toast.error("Unable to change microphone settings.");
}
    };

    const toggleCamera = async () => {
        const room = roomRef.current;

        if (!room || !roomConnected) return;

        try {
            const nextState = !cameraEnabled;

            await room.localParticipant.setCameraEnabled(nextState);

            setCameraEnabled(nextState);

            syncTracks(room);
} catch (err) {
    toast.error("Unable to change camera settings.");
}
    };

    const leaveMeeting = () => {
        if (roomRef.current) {
            roomRef.current.disconnect();
            roomRef.current = null;
        }

        setRoomConnected(false);
        navigate(-1);
    };

    const retryConnection = () => {
        window.location.reload();
    };

    const videoTracks = mediaTracks;

    return (
        <div className="flex min-h-screen flex-col bg-gray-950 text-white">

            <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                <div>
                    <h1 className="text-lg font-semibold">
                        HireFlow HR Interview
                    </h1>

                    <p className="text-sm text-gray-400">
                        Interview ID: {interviewId}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <span
                        className={`h-2.5 w-2.5 rounded-full ${
                            roomConnected
                                ? "bg-green-500"
                                : "bg-yellow-500"
                        }`}
                    />

                    <span className="text-sm text-gray-300">
                        {roomConnected ? "Connected" : "Connecting"}
                    </span>
                </div>
            </header>

            <main className="flex flex-1 flex-col items-center justify-center p-5">

                {loading || connecting ? (
                    <div className="text-center">
                        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-white" />

                        <p className="text-gray-300">
                            Connecting to interview room...
                        </p>
                    </div>
                ) : error ? (
                    <div className="max-w-md rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center">
                        <h2 className="mb-2 text-lg font-semibold text-red-400">
                            Connection failed
                        </h2>

                        <p className="mb-5 text-sm text-gray-300">
                            {error}
                        </p>

                        <div className="flex justify-center gap-3">
                            <button
                                onClick={retryConnection}
                                className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-900"
                            >
                                Retry
                            </button>

                            <button
                                onClick={leaveMeeting}
                                className="rounded-lg border border-white/20 px-4 py-2 text-sm"
                            >
                                Go back
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-6xl">

                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-lg font-medium">
                                Live Interview
                            </h2>

                            <span className="text-sm text-gray-400">
                                {videoTracks.length} video participant(s)
                            </span>
                        </div>

                        {videoTracks.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {videoTracks.map((item) => (
                                    <VideoTile
                                        key={item.id}
                                        mediaTrack={item}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex min-h-[350px] items-center justify-center rounded-xl bg-gray-900">
                                <p className="text-gray-400">
                                    Waiting for participants...
                                </p>
                            </div>
                        )}

                        {mediaTracks.map((item) => null)}

                        {roomRef.current &&
                            Array.from(
                                roomRef.current.remoteParticipants.values()
                            ).map((participant) =>
                                Array.from(
                                    participant.trackPublications.values()
                                )
                                    .filter(
                                        (publication) =>
                                            publication.track?.kind === Track.Kind.Audio
                                    )
                                    .map((publication) => (
                                        <AudioOutput
                                            key={publication.trackSid}
                                            track={publication.track}
                                        />
                                    ))
                            )}

                    </div>
                )}
            </main>

            <footer className="flex items-center justify-center gap-4 border-t border-white/10 px-5 py-5">

                <button
                    onClick={toggleMicrophone}
                    disabled={!roomConnected}
                    className={`rounded-full px-5 py-3 text-sm font-medium disabled:opacity-40 ${
                        microphoneEnabled
                            ? "bg-gray-700 hover:bg-gray-600"
                            : "bg-red-600 hover:bg-red-500"
                    }`}
                >
                    {microphoneEnabled ? "Mute microphone" : "Unmute microphone"}
                </button>

                <button
                    onClick={toggleCamera}
                    disabled={!roomConnected}
                    className={`rounded-full px-5 py-3 text-sm font-medium disabled:opacity-40 ${
                        cameraEnabled
                            ? "bg-gray-700 hover:bg-gray-600"
                            : "bg-red-600 hover:bg-red-500"
                    }`}
                >
                    {cameraEnabled ? "Turn camera off" : "Turn camera on"}
                </button>

                <button
                    onClick={leaveMeeting}
                    className="rounded-full bg-red-600 px-6 py-3 text-sm font-semibold hover:bg-red-500"
                >
                    Leave interview
                </button>

            </footer>
        </div>
    );
}

export default HRInterviewRoom;
