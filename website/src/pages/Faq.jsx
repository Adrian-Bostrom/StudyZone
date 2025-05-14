function Faq() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-gray-100 px-6 py-10">
        
      <h1 className="text-4xl font-bold mb-6">FAQ</h1>
      <div className="max-w-3xl w-full space-y-6 text-gray-800">
        <div>
          <h2 className="text-xl font-semibold">What is StudyZone?</h2>
          <p className="mt-1 text-base">
            StudyZone is an online platform that provides educational resources and tools to help students with their studies.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">How can I sign up?</h2>
          <p className="mt-1 text-base">
            You can sign up by clicking on the "Signup" button on the Login page and filling out the registration form.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Is there a fee to use StudyZone?</h2>
          <p className="mt-1 text-base">
            StudyZone is free!
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">How can I contact support?</h2>
          <p className="mt-1 text-base">
            You can contact our support team by clicking on the "Contact" link at the bottom of the homepage.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">What type of GPT is provided?</h2>
          <p className="mt-1 text-base">
            ChatGPT-4o mini, from OpenAI.
          </p>
        </div>
      </div>
      </div>
  );
}

export default Faq;
