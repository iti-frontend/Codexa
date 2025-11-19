// ... نفس importاتك
export default function InstructorProfileView() {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = () => {
    try {
      const userInfoCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("userInfo="))
        ?.split("=")[1];

      if (userInfoCookie) {
        const user = JSON.parse(decodeURIComponent(userInfoCookie));
        setProfile(user);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProfile(); }, [pathname]);
  useEffect(() => {
    const handleFocus = () => loadProfile();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  if (loading) return <div className="min-h-screen ...">Loading...</div>;
  if (!profile) return <div className="min-h-screen ...">Profile not found</div>;

  const updatedDate = profile.updatedAt ? new Date(profile.updatedAt) : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          <Link href="/instructor/profile" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Edit Profile
          </Link>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-32"></div>

          <div className="px-8 pb-8">
            {/* Profile Image and Info */}
            <div className="flex items-start -mt-16 mb-6">
              <img
                src={profile.profileImage || "/uploads/default-avatar.png"}
                alt={profile.name || "Instructor"}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <div className="ml-6 mt-16">
                <h2 className="text-2xl font-bold text-gray-800">{profile.name || "-"}</h2>
                <p className="text-gray-600">{profile.email || "-"}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">{profile.role || "-"}</span>
                  {profile.emailVerified && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">✓ Verified</span>
                  )}
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Account Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="font-medium text-gray-800">
                    {profile.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Updated</p>
                  <p className="font-medium text-gray-800">
                    {updatedDate
                      ? `${updatedDate.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })} `
                      : "-"}
                    {updatedDate && (
                      <span className="text-blue-600 font-semibold">
                        {`${updatedDate.getHours().toString().padStart(2, "0")}:${updatedDate.getMinutes().toString().padStart(2, "0")}`}
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Account Status</p>
                  <p className={`font-medium ${profile.isActive ? "text-green-600" : "text-red-600"}`}>
                    {profile.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Auth Provider</p>
                  <p className="font-medium text-gray-800 capitalize">{profile.authProvider || "Email"}</p>
                </div>

                {/* Bio */}
                {profile.bio && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Bio</p>
                    <p className="text-gray-800">{profile.bio}</p>
                  </div>
                )}

                {/* Links */}
                {profile.links && profile.links.length > 0 && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Links</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {profile.links.map((link, i) => (
                        <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                          {link.label || link.url}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
