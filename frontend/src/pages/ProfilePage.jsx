import Sidebar from "../components/Sidebar";

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen bg-surface text-white">
      <Sidebar />

      <div className="flex-1 p-8 max-w-4xl">

        <h1 className="text-4xl font-bold mb-8">
          👤 My Profile
        </h1>

        <div className="bg-zinc-900 rounded-2xl p-8">

          <div className="flex justify-center">
            <img
              src="https://ui-avatars.com/api/?name=CryvixAI"
              alt="Profile"
              className="w-32 h-32 rounded-full"
            />
          </div>

          <div className="mt-8 space-y-4">

            <input
              className="w-full p-3 rounded-xl text-black"
              value="Santosh"
              readOnly
            />

            <input
              className="w-full p-3 rounded-xl text-black"
              value="santoshsengar2@gmail.com"
              readOnly
            />

            <input
              className="w-full p-3 rounded-xl text-black"
              value="Free Plan"
              readOnly
            />

          </div>

        </div>

      </div>

    </div>
  );
}