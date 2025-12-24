'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from '@/hooks/useLiveSessions';
import liveSessionService from '@/services/liveSessionService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Video, Users, ArrowLeft, PhoneOff, Mic, MicOff, Video as VideoIcon, VideoOff, MonitorUp, MessageSquare, BarChart2, Power, Maximize, Minimize, Disc } from 'lucide-react';
import { toast } from 'sonner';
import PollComponent from '@/components/live-sessions/PollComponent';
import CreatePollComponent from '@/components/live-sessions/CreatePollComponent';
import VideoTile from '@/components/live-sessions/VideoTile';
import ChatComponent from '@/components/live-sessions/ChatComponent';
import SessionTimer from '@/components/live-sessions/SessionTimer';
import Link from 'next/link';

// 100ms Imports
import {
  HMSRoomProvider,
  useHMSActions,
  useHMSStore,
  useHMSNotifications,
  HMSNotificationTypes,
  selectIsConnectedToRoom,
  selectPeers,
  selectIsLocalAudioEnabled,
  selectIsLocalVideoEnabled,
  selectLocalPeer,
  selectIsLocalScreenShared,
  selectRecordingState
} from "@100mslive/react-sdk";

// Inner component that uses HMS hooks
function LiveRoomContent({ session, sessionId, refetchSession }) {
  const router = useRouter();
  const hmsActions = useHMSActions();
  const notification = useHMSNotifications();
  
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const peers = useHMSStore(selectPeers);
  const localPeer = useHMSStore(selectLocalPeer);
  const isAudioEnabled = useHMSStore(selectIsLocalAudioEnabled);
  const isVideoEnabled = useHMSStore(selectIsLocalVideoEnabled);
  const isScreenShared = useHMSStore(selectIsLocalScreenShared);
  const recordingState = useHMSStore(selectRecordingState);
  const isRecording = recordingState?.browser?.running;

  const [joining, setJoining] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const videoContainerRef = useRef(null);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      videoContainerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  // ✅ Utility function to filter duplicate peers
  const getUniquePeers = (peersList) => {
    return peersList.reduce((acc, peer) => {
      const userId = peer.customerUserId || peer.name;
      const existingIndex = acc.findIndex(p => 
        (p.customerUserId || p.name) === userId
      );
      
      if (existingIndex === -1) {
        acc.push(peer);
      } else {
        // Keep the most recent peer
        acc[existingIndex] = peer;
      }
      
      return acc;
    }, []);
  };

  // Handle Room Ended Notification (For Students)
  useEffect(() => {
    if (!notification) return;

    if (notification.type === HMSNotificationTypes.ROOM_ENDED) {
      toast.info('The session has been ended by the instructor.');
      router.push(`/live-sessions/${sessionId}`);
    }
    
    // Also handle if removed from room
    if (notification.type === HMSNotificationTypes.REMOVED_FROM_ROOM) {
        toast.warning('You have been removed from the session.');
        router.push(`/live-sessions/${sessionId}`);
    }
  }, [notification, router, sessionId]);


  const handleJoinRoom = async () => {
    try {
      setJoining(true);
      // 1. Get Token from Backend
      const data = await liveSessionService.joinSession(sessionId);
      
      setCurrentUser({
          _id: data.userId,
          name: data.userName,
          image: data.userImage,
          role: data.userRole
      });

      // 2. Join 100ms Room with userId to prevent duplicates
      await hmsActions.join({
        authToken: data.token,
        userName: data.userName || 'User',
        userId: data.userId, // ✅ Add userId to identify same user
        settings: {
          isAudioMuted: false,
          isVideoMuted: false
        },
        metaData: JSON.stringify({
          userId: data.userId,
          role: data.userRole,
          image: data.userImage
        })
      });
      
      toast.success('Joined session successfully!');
    } catch (error) {
      console.error('Error joining session:', error);
      toast.error(error.response?.data?.message || 'Failed to join session');
      setJoining(false);
    }
  };

  const handleLeaveRoom = async () => {
    await hmsActions.leave();
    router.push(`/live-sessions/${sessionId}`);
  };

  const handleEndSession = async () => {
      if (!confirm("Are you sure you want to end this session for everyone?")) return;

      try {
          // 1. End in 100ms (Kicks everyone out)
          await hmsActions.endRoom({
              reason: "Session ended by instructor",
              lock: true // Prevent rejoining
          });

          // 2. End in Backend
          await liveSessionService.endSession(sessionId);

          toast.success("Session ended successfully");
          router.push(`/live-sessions/${sessionId}`);
      } catch (error) {
          console.error("Error ending session:", error);
          toast.error("Failed to end session properly");
          // Force leave anyway
          await hmsActions.leave();
          router.push(`/live-sessions/${sessionId}`);
      }
  };

  const toggleAudio = async () => {
    await hmsActions.setLocalAudioEnabled(!isAudioEnabled);
  };

  const toggleVideo = async () => {
    await hmsActions.setLocalVideoEnabled(!isVideoEnabled);
  };

  const toggleScreenShare = async () => {
    try {
      await hmsActions.setScreenShareEnabled(!isScreenShared);
    } catch (error) {
      console.error('Error toggling screen share:', error);
      toast.error(error.message || 'Failed to toggle screen share');
    }
  };

  const toggleRecording = async () => {
    try {
      if (isRecording) {
        if (!confirm("Are you sure you want to stop the recording?")) return;
        await hmsActions.stopRTMPAndRecording();
        toast.success("Recording stopped");
      } else {
        await hmsActions.startRTMPOrRecording({
          record: true // This starts 'Browser Recording' (Composite)
        });
        toast.success("Recording started");
      }
    } catch (error) {
      console.error('Error toggling recording:', error);
      toast.error(error.message || 'Failed to toggle recording');
    }
  };

  if (!isConnected) {
    return (
      <div className="lg:col-span-2 space-y-6">
        <Card className="p-12 text-center border-2">
          <div className="max-w-md mx-auto space-y-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Video className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Ready to join?</h2>
              <p className="text-muted-foreground">
                Click the button below to join the live session
              </p>
            </div>
            <Button
              size="lg"
              onClick={handleJoinRoom}
              disabled={joining}
              className="w-full gap-2"
            >
              {joining ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  <Video className="w-5 h-5" />
                  Join Live Session
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Session Info */}
        <Card className="p-6">
          <h3 className="font-semibold mb-2">About this session</h3>
          <p className="text-muted-foreground">
            {session.description || 'No description available'}
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span>{session.totalViewers || 0} Total Attendees</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Instructor:</span>
              <span className="font-medium">{session.instructor?.name}</span>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const isHost = localPeer?.roleName === 'host';

  return (
    <>
    {/* Room Header - Now inside Content to access peers */}
    <div className="col-span-full mb-4 border-b bg-card -mx-4 px-4 pb-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
            <Button
                variant="ghost"
                size="sm"
                onClick={handleLeaveRoom}
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
            </Button>
            <div>
                <h1 className="text-xl font-bold">{session.title}</h1>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge className="bg-red-500 animate-pulse">🔴 LIVE</Badge>
                {isRecording && <Badge className="bg-red-700 animate-pulse flex items-center gap-1"><Disc className="w-3 h-3" /> REC</Badge>}
                <SessionTimer startedAt={session.startedAt} />
                <span className="text-sm text-muted-foreground">
                    {getUniquePeers(peers).length} Live Viewers
                </span>
                </div>
            </div>
            </div>
        </div>
    </div>

    <div className="lg:col-span-2 space-y-6">
      <div ref={videoContainerRef} className="overflow-hidden border-2 bg-black rounded-xl shadow-sm flex flex-col">
        {/* Video Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-4 min-h-[400px] flex-1 ${isFullScreen ? 'h-full' : ''}`}>
          {getUniquePeers(peers).map((peer) => (
            <VideoTile key={peer.id} peer={peer} />
          ))}
          {/* Render Screen Shares */}
          {getUniquePeers(peers).map((peer) => (
             peer.auxiliaryTracks?.map((trackId) => (
               <VideoTile key={trackId} peer={peer} trackId={trackId} isScreenShare={true} />
             ))
          ))}
          {peers.length === 0 && (
            <div className="col-span-full flex items-center justify-center text-white/50 h-full">
              Waiting for others to join...
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-4 bg-card border-t flex items-center justify-center gap-4 flex-wrap">
          <Button 
            variant={isAudioEnabled ? "outline" : "destructive"} 
            size="icon" 
            onClick={toggleAudio}
            className="rounded-full w-12 h-12"
          >
            {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </Button>
          
          <Button 
            variant={isVideoEnabled ? "outline" : "destructive"} 
            size="icon" 
            onClick={toggleVideo}
            className="rounded-full w-12 h-12"
          >
            {isVideoEnabled ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </Button>

          <Button 
            variant={isScreenShared ? "default" : "outline"} 
            size="icon"
            className={`rounded-full w-12 h-12 ${isScreenShared ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}`}
            onClick={toggleScreenShare}
          >
            <MonitorUp className="w-5 h-5" />
          </Button>

          {isHost && (
            <Button 
                variant={isRecording ? "destructive" : "outline"} 
                size="icon"
                className={`rounded-full w-12 h-12 ${isRecording ? 'animate-pulse' : ''}`}
                onClick={toggleRecording}
                title={isRecording ? "Stop Recording" : "Start Recording"}
            >
                <Disc className="w-5 h-5" />
            </Button>
          )}

          <Button 
            variant="outline" 
            size="icon"
            className="rounded-full w-12 h-12"
            onClick={toggleFullScreen}
          >
            {isFullScreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </Button>

          {/* Leave / End Buttons */}
          <div className="flex items-center gap-2 ml-4 border-l pl-4">
              <Button 
                variant="secondary" 
                onClick={handleLeaveRoom}
                className="rounded-full px-6"
              >
                <PhoneOff className="w-5 h-5 mr-2" />
                Leave
              </Button>

              {isHost && (
                  <Button 
                    variant="destructive" 
                    onClick={handleEndSession}
                    className="rounded-full px-6"
                  >
                    <Power className="w-5 h-5 mr-2" />
                    End Session
                  </Button>
              )}
          </div>
        </div>
      </div>

      {/* Session Info (Collapsed when joined) */}
      <div className="flex items-center justify-between text-sm text-muted-foreground px-2">
        <span>Room ID: {session.roomId}</span>
        <span>Role: {localPeer?.roleName}</span>
      </div>
    </div>

    {/* Sidebar - Chat & Polls */}
    <div className="h-[600px] flex flex-col">
        <Tabs defaultValue="chat" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="chat"><MessageSquare className="w-4 h-4 mr-2"/> Chat</TabsTrigger>
                <TabsTrigger value="polls"><BarChart2 className="w-4 h-4 mr-2"/> Polls</TabsTrigger>
                <TabsTrigger value="people"><Users className="w-4 h-4 mr-2"/> People</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="flex-1 mt-2 h-full">
                <ChatComponent 
                    sessionId={sessionId} 
                    initialComments={session.comments} 
                    currentUser={currentUser}
                />
            </TabsContent>
            
            <TabsContent value="polls" className="flex-1 mt-2 overflow-y-auto">
                <div className="space-y-4">
                    {localPeer?.roleName === 'host' && (
                        <CreatePollComponent 
                            sessionId={sessionId} 
                            onPollCreated={() => {
                                // Refresh session data without reloading the page
                                refetchSession();
                            }} 
                        />
                    )}

                    {session.polls?.length > 0 ? (
                        session.polls.map((poll) => (
                            <PollComponent
                                key={poll._id}
                                sessionId={sessionId}
                                poll={poll}
                                isInstructor={localPeer?.roleName === 'host'}
                            />
                        ))
                    ) : (
                        <div className="text-center text-muted-foreground py-10">
                            No polls active
                        </div>
                    )}
                </div>
            </TabsContent>
            
            <TabsContent value="people" className="flex-1 mt-2 overflow-y-auto">
                <Card className="p-4">
                    {(() => {
                        const uniquePeers = getUniquePeers(peers);
                        return (
                            <>
                                <h3 className="font-semibold mb-4">In this room ({uniquePeers.length})</h3>
                                <div className="space-y-3">
                                    {uniquePeers.map((peer) => (
                                        <div key={peer.id} className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                                                {peer.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {peer.name} {peer.isLocal && '(You)'}
                                                </p>
                                                <p className="text-xs text-muted-foreground capitalize">
                                                    {peer.roleName}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        );
                    })()}
                </Card>
            </TabsContent>
        </Tabs>
    </div>
    </>
  );
}

// Main Page Component
export default function LiveRoomPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id;

  const { session, loading: sessionLoading, refetch } = useSession(sessionId);

  if (sessionLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-lg text-muted-foreground">Session not found</p>
        <Button asChild className="mt-4">
          <Link href="/live-sessions">Back to Sessions</Link>
        </Button>
      </div>
    );
  }

  return (
    <HMSRoomProvider>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Content is handled inside LiveRoomContent to access HMS hooks */}
            <LiveRoomContent session={session} sessionId={sessionId} refetchSession={refetch} />
          </div>
        </div>
      </div>
    </HMSRoomProvider>
  );
}
