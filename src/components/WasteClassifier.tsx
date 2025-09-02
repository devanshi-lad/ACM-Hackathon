import React, { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Upload, Camera, Recycle, Leaf, AlertTriangle, History, Sparkles, Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { classifyWaste, ClassificationResult } from "@/lib/waste-classifier";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";

/* ----------------------------- Upload Area ------------------------------ */
interface UploadAreaProps {
  onImageUpload: (file: File) => void;
  onStartCamera: () => void;
  isProcessing: boolean;
}
const UploadArea: React.FC<UploadAreaProps> = ({ onImageUpload, onStartCamera, isProcessing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles[0]) onImageUpload(acceptedFiles[0]);
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, multiple: false, accept: { "image/*": [] }
  });

  return (
    <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.35 }}>
      <Card className={`border-2 border-dashed transition-colors ${isDragActive ? "border-accent" : "hover:border-accent"}`}>
        <CardContent className="p-8">
          <div {...getRootProps()} className="text-center cursor-pointer">
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Upload Waste Image</h3>
            <p className="text-muted-foreground mb-6">
              Drag & drop your image here, or click to browse
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                type="button"
                className="bg-gradient-eco text-primary-foreground hover:shadow-glow"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                disabled={isProcessing}
              >
                <Upload className="w-4 h-4 mr-2" /> Choose File
              </Button>

              {/* Camera Button */}
              <Button
                type="button"
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  onStartCamera();
                }}
                disabled={isProcessing}
              >
                <Camera className="w-4 h-4 mr-2" /> Use Camera
              </Button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && onImageUpload(e.target.files[0])}
            className="hidden"
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

/* ----------------------------- Result Card ------------------------------ */
const ResultCard: React.FC<{ result: ClassificationResult }> = ({ result }) => {
  const icons = {
    recyclable: <Recycle className="w-8 h-8" />,
    biodegradable: <Leaf className="w-8 h-8" />,
    hazardous: <AlertTriangle className="w-8 h-8" />,
  };

  const colorClass = {
    recyclable: "text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-300 dark:bg-blue-900/20 dark:border-blue-800",
    biodegradable: "text-green-600 bg-green-50 border-green-200 dark:text-green-300 dark:bg-green-900/20 dark:border-green-800",
    hazardous: "text-red-600 bg-red-50 border-red-200 dark:text-red-300 dark:bg-red-900/20 dark:border-red-800",
  }[result.category];

  const tip = {
    recyclable: "Place in recycling bin. Rinse containers before recycling.",
    biodegradable: "Compost or place in organic waste bin.",
    hazardous: "Take to a certified disposal facility. Do not put in regular trash.",
  }[result.category];

  return (
    <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 120, damping: 14 }}>
      <Card className={`border-2 ${colorClass} shadow-eco`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-full ${colorClass}`}>{icons[result.category]}</div>
            <div>
              <h3 className="text-xl font-bold capitalize">{result.category}</h3>
              <p className="text-sm text-muted-foreground">
                Confidence: {(result.confidence * 100).toFixed(1)}%
              </p>
            </div>
          </div>
          <Progress value={result.confidence * 100} className="mb-4" />
          <div className="bg-muted/40 rounded-lg p-4">
            <h4 className="font-semibold mb-1">Disposal Recommendation</h4>
            <p className="text-sm text-muted-foreground">{tip}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

/* --------------------------- Main Classifier ---------------------------- */
export const WasteClassifier: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [history, setHistory] = useState<ClassificationResult[]>([]);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file type", description: "Please upload an image file.", variant: "destructive" });
      return;
    }
    setIsProcessing(true);
    setResult(null);

    try {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);

      const classification = await classifyWaste(file);

      setResult(classification);
      setHistory(prev => [classification, ...prev].slice(0, 3));

      toast({
        title: "Classification complete",
        description: `Detected: ${classification.category} (${(classification.confidence * 100).toFixed(1)}% confidence)`,
      });
    } catch (e) {
      console.error(e);
      toast({ title: "Classification failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsCameraOn(true);
    } catch (err) {
      console.error("Camera error:", err);
      toast({
        title: "Camera access denied",
        description: "Please allow camera permissions in your browser.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
          handleImageUpload(file);
          stopCamera();
        }
      }, "image/jpeg");
    }
  };

  const reset = () => {
    setSelectedImage(null);
    setResult(null);
    setIsCameraOn(false);
  };

  // Clean up camera when unmounted
  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-eco bg-clip-text text-transparent mb-3">
          AI Waste Classifier
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload an image — our model classifies it as <b>recyclable</b>, <b>biodegradable</b>, or
          <b> hazardous</b> with confidence and disposal tips.
        </p>
        <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
          <Sparkles className="w-4 h-4" /> <span>Live demo · No downloads</span>
        </div>
      </motion.div>

      {/* Upload / Camera / Preview */}
      <AnimatePresence mode="wait">
        {!selectedImage && !isCameraOn ? (
          <motion.div key="uploader" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <UploadArea onImageUpload={handleImageUpload} onStartCamera={startCamera} isProcessing={isProcessing} />
          </motion.div>
        ) : isCameraOn ? (
          <motion.div key="camera" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-6 text-center">
            <video ref={videoRef} autoPlay playsInline className="mx-auto rounded-lg border shadow-lg max-h-[400px]" />
            <div className="flex justify-center gap-3">
              <Button onClick={capturePhoto} className="bg-green-600 hover:bg-green-700 text-white">
                Capture Photo
              </Button>
              <Button variant="destructive" onClick={stopCamera}>
                Stop Camera
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="preview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-6">
            <Card className="overflow-hidden shadow-eco">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Uploaded Image</CardTitle>
                <Button variant="outline" onClick={reset} className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  Upload New
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative">
                  <motion.img
                    src={selectedImage || ""}
                    alt="Uploaded waste"
                    className="w-full h-auto max-h-[520px] object-contain bg-muted"
                    initial={{ scale: 0.98, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.35 }}
                  />
                  <AnimatePresence>
                    {isProcessing && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/80 flex items-center justify-center">
                        <div className="text-center">
                          <Loader2 className="animate-spin w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Classifying…</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
            {result && <ResultCard result={result} />}
          </motion.div>
        )}
      </AnimatePresence>

      {/* History */}
      {history.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <History className="w-5 h-5" />
              <CardTitle>Recent Classifications</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 sm:grid-cols-3">
              {history.map((h, i) => (
                <div key={i} className="rounded-md border p-3 text-sm flex items-center justify-between">
                  <span className="capitalize">{h.category}</span>
                  <span className="text-muted-foreground">{(h.confidence * 100).toFixed(1)}%</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
