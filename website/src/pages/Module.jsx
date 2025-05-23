import ChatBox  from "./components/ChatBox";
import fileIcon from "../assets/fileIcon.svg"

function Course() {
    return (
      <>
        <div className="flex h-[calc(100vh-80px)] bg-gray-100 p-12 flex-row">
        <ChatBox/>
            <div className="w-1/2 p-6">
                <h1 className="text-5xl font-bold mb-1">IK1203</h1>
                <h2 className="text-2xl font-bold mb-4 text-gray-600">Geometry</h2>
            
                <div className="bg-gray-200 p-5 rounded-2xl">
                    <p className="text-xl"> Module Overview:</p>
                    <br />
                    <p> The Geometry module offers an in-depth study of geometric concepts, focusing on understanding shapes, sizes, and their properties, as well as spatial relationships. This module is designed to build a strong foundation in geometric principles, emphasizing both theoretical and practical aspects. Students will explore the geometric structures in both two-dimensional and three-dimensional spaces, developing critical thinking and problem-solving skills through various geometric theorems and applications.</p>
                    <p className="float-right text-gray-500">Generated by brbrpatapim</p>
                    <br />
                </div>
                <br />
                <div className="bg-gray-200 p-5 rounded-2xl">
                    <p className="text-xl"> Attachments:</p>
                    <div className="flex items-center">
                        <img src={fileIcon} className="h-[1em] mr-3 ml-5" alt="" />
                        Geometry
                    </div>
                </div>
            </div>
            <div className="w-1/2 h-[100%] p-6">
                <h1 className="text-5xl font-bold mb-1"><br /></h1>
                <h2 className="text-2xl font-bold mb-4 text-gray-600">Deadline:</h2>

                <div className="w-[100%] h-[40%] bg-gray-200 rounded-xl flex">
                    <p className="m-auto text-gray-500">Nothing to do...</p>
                </div>
                <br />
                <h2 className="text-2xl font-bold mb-4 text-gray-600">Ask brbrpatapim:</h2>
                <div className="w-[100% flex">
                    <button className="p-3 bg-blue-500 rounded-xl text-white mx-2 font-bold transition-transform hover:scale-103 duration-300">Generate a question...</button>
                    <button className="p-3 bg-blue-500 rounded-xl text-white mx-2 font-bold transition-transform hover:scale-103 duration-300">Generate a quiz...</button>
                    <button className="p-3 bg-blue-500 rounded-xl text-white mx-2 font-bold transition-transform hover:scale-103 duration-300">Generate an exam...</button>                
                </div>
            </div>
        </div>
      </>
    );
  }
  
  export default Course;