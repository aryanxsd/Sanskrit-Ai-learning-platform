import React from "react";

type Props = {
  onUpload: (file: File) => void;
};

const AudioUploader: React.FC<Props> = ({ onUpload }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <label className="block text-lg font-semibold mb-2">
        Upload Sanskrit Audio (.mp3 / .wav)
      </label>
      <input
        type="file"
        accept="audio/*"
        onChange={handleChange}
        className="w-full"
      />
    </div>
  );
};

export default AudioUploader;