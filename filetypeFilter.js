const filetypes = [
  { label: 'PDF (.pdf)', value: 'pdf' },
  { label: 'Word (.doc, .docx)', value: 'doc,docx' },
  { label: 'Excel (.xls, .xlsx)', value: 'xls,xlsx' },
  { label: 'PowerPoint (.ppt, .pptx)', value: 'ppt,pptx' },
  { label: 'TXT (.txt)', value: 'txt' },
  { label: 'JPEG (.jpg, .jpeg)', value: 'jpg,jpeg' },
  { label: 'PNG (.png)', value: 'png' },
  { label: 'GIF (.gif)', value: 'gif' },
  { label: 'SVG (.svg)', value: 'svg' },
  { label: 'MP4 (.mp4)', value: 'mp4' },
  { label: 'AVI (.avi)', value: 'avi' },
  { label: 'MKV (.mkv)', value: 'mkv' },
  { label: 'MOV (.mov)', value: 'mov' },
  { label: 'MP3 (.mp3)', value: 'mp3' },
  { label: 'WAV (.wav)', value: 'wav' },
  { label: 'FLAC (.flac)', value: 'flac' },
  { label: 'ZIP (.zip)', value: 'zip' },
  { label: 'RAR (.rar)', value: 'rar' }
];

const getFiletypeOptions = () => {
  return filetypes;
};

export { getFiletypeOptions };