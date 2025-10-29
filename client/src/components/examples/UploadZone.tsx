import UploadZone from '../UploadZone';

export default function UploadZoneExample() {
  return (
    <UploadZone 
      onImageSelect={(file) => console.log('File selected:', file.name)}
    />
  );
}
