import { useVideo } from "@100mslive/react-sdk";

export default function VideoTile({ peer, trackId, isScreenShare = false }) {
  const { videoRef } = useVideo({
    trackId: trackId || peer.videoTrack
  });

  return (
    <div className={`relative bg-gray-900 rounded-lg overflow-hidden border border-gray-800 ${isScreenShare ? 'col-span-full aspect-video' : 'aspect-video'}`}>
      <video
        ref={videoRef}
        autoPlay
        muted={false}
        playsInline
        className={`w-full h-full ${isScreenShare ? 'object-contain' : 'object-cover'} ${peer.isLocal && !isScreenShare ? 'scale-x-[-1]' : ''}`}
      />
      
      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-md text-white text-sm font-medium flex items-center gap-2">
        <span>{peer.name} {peer.isLocal ? "(You)" : ""} {isScreenShare ? "(Screen)" : ""}</span>
        {peer.roleName === 'host' && (
          <span className="bg-red-500 text-[10px] px-1.5 py-0.5 rounded uppercase">Host</span>
        )}
      </div>
    </div>
  );
}
