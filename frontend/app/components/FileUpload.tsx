'use client';

interface FileUploadProps {
  onFileLoad: (content: string, filename: string) => void;
}

const SUPPORTED_EXTENSIONS = ['.py', '.js', '.ts', '.sql', '.java', '.go', '.cpp', '.sh'];

export default function FileUpload({ onFileLoad }: FileUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!SUPPORTED_EXTENSIONS.includes(ext)) {
      alert(`Unsupported file type. Supported: ${SUPPORTED_EXTENSIONS.join(', ')}`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      onFileLoad(content, file.name);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <label className="cursor-pointer flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white text-sm px-3 py-1.5 rounded-md border border-gray-600 transition-colors">
      📁 Upload File
      <input
        type="file"
        accept={SUPPORTED_EXTENSIONS.join(',')}
        onChange={handleFileChange}
        className="hidden"
      />
    </label>
  );
}