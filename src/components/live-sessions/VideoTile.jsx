import { useVideo } from "@100mslive/react-sdk";

export default function VideoTile({ peer }) {
  const { videoRef } = useVideo({
    trackId: peer.videoTrack
  });

  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video border border-gray-800">
      <video
        ref={videoRef}
        autoPlay
        muted={false}
        playsInline
        className={`w-full h-full object-cover ${peer.isLocal ? 'scale-x-[-1]' : ''}`}
      />
      
      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-md text-white text-sm font-medium flex items-center gap-2">
        <span>{peer.name} {peer.isLocal ? "(You)" : ""}</span>
        {peer.roleName === 'host' && (
          <span className="bg-red-500 text-[10px] px-1.5 py-0.5 rounded uppercase">Host</span>
        )}
      </div>
    </div>
  );
}
