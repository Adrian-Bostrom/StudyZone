import ChatBox  from "./components/ChatBox";

function Courses() {
    return (
      <>
        <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-100 p-12">
        <ChatBox/>
          <h1 className="text-5xl font-bold mb-1">IK1203</h1>
          <h2 className="text-2xl font-bold mb-4 text-gray-600">Derivation and Integration</h2>
          <p className="text-gray-600 text-center max-w-2xl">
            This is the about page. Here you can learn more about StudyZone and its mission to provide quality education resources.
          </p>
        </div>
      </>
    );
  }
  
  export default Courses;