import { use, useState } from 'react';

function Moduler() {
  

  var buttonColors = ['shadow-red-500', 'shadow-orange-500', 'shadow-yellow-500', 'shadow-green-600'];
  
  // Individuell state för varje knapp
  const [buttonColor1, setButtonColor1] = useState(buttonColors[0]);
  const [buttonColor2, setButtonColor2] = useState(buttonColors[1]);

  return(
    <div>
    <div className="max-w-4xl mx-auto mt-10 p-6 border-2 border-gray-200 rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Modul 1*
      </h2>
      <p className="text-gray-600 text-lg mb-6">
        *sammanfattning om modul 1*
      </p>

      {/* Container for buttons and the large text */}
      <div className="flex space-x-6">
        {/* Buttons Section */}
        <div className="flex flex-col w-full">
          {/* Första klickbara rutan */}
          <button 
            className={`w-full p-4 border-2 border-gray-300 rounded-lg bg-gray-50 shadow-lg ${buttonColor1} hover:shadow-xl transition duration-300`}
            onClick={() => setButtonColor1(buttonColors[(buttonColors.indexOf(buttonColor1) + 1) % buttonColors.length])}
          >
            <p className="text-gray-700 whitespace-pre-line">{data.content}</p>
          </button>

          {/* Andra klickbara rutan */}
          <button 
            className={`w-full p-4 border-2 border-gray-300 rounded-lg bg-gray-50 shadow-lg ${buttonColor2} hover:shadow-xl transition duration-300 mt-4`}
            onClick={() => setButtonColor2(buttonColors[(buttonColors.indexOf(buttonColor2) + 1) % buttonColors.length])}
          >
            <p className="text-gray-700">*här är konkret infopunkter som finns i modulen*</p>
          </button>
        </div>
      </div>
      
    </div>
    <div className="flex-1">
          <p className="text-4xl font-bold text-gray-800">
            Här är viktig information om modulen
          </p>
          <p className="text-xl text-gray-600 mt-4">
            Mer detaljerad information om modulen kan gå här.
          </p>
        </div>
    
    </div>
  );
}

export default Moduler;
