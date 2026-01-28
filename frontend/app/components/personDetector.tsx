"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertTriangle, CheckCircle2, UserSearch } from "lucide-react";

// IMPORT THE SERVER ACTION
import { detectPeople } from "@/lib/yolo"; 

export function PersonDetector({ ...props }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"file" | "url">("file");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ person_count: number } | null>(null);

  const resetState = () => {
    setFile(null);
    setFileName(null);
    setImageUrl("");
    setIsLoading(false);
    setError(null);
    setResult(null);
    setActiveTab("file");
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) setTimeout(resetState, 500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError(null);
      setResult(null);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Create FormData to send to the server action
      const formData = new FormData();
      
      if (activeTab === "file") {
        if (!file) throw new Error("Please select a file to upload.");
        formData.append("file", file);
      } else {
        if (!imageUrl || !imageUrl.startsWith("http")) {
          throw new Error("Please enter a valid URL.");
        }
        formData.append("imageUrl", imageUrl);
      }

      // CALL THE SERVER ACTION
      const data = await detectPeople(formData);

      setResult({ person_count: data.person_count });
      
      if (props.setPercent) {
        props.setPercent([Math.round((data.person_count / 15) * 100)]);
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to analyze image.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserSearch className="mr-2 h-4 w-4" />
          AI Selfie Check
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Person Detector (Cloud API)</DialogTitle>
          <DialogDescription>
            Uses Hugging Face Inference API (Free Tier).
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "file" | "url")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="file">Upload File</TabsTrigger>
            <TabsTrigger value="url">From URL</TabsTrigger>
          </TabsList>

          <TabsContent value="file" className="mt-4 space-y-3">
            <Label htmlFor="picture">Select Image</Label>
            <Input id="picture" type="file" onChange={handleFileChange} accept="image/png, image/jpeg" />
            {fileName && (
              <p className="text-sm text-muted-foreground">
                Selected: <span className="font-medium">{fileName}</span>
              </p>
            )}
          </TabsContent>

          <TabsContent value="url" className="mt-4 space-y-3">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              type="text"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </TabsContent>
        </Tabs>

        <div className="mt-4 min-h-[60px]">
          {isLoading && (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-muted-foreground">Contacting API...</span>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription className="break-words">{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <Alert variant="default" className="border-green-500 text-green-700 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-700">Success!</AlertTitle>
              <AlertDescription className="font-semibold text-lg text-green-800">
                Found {result.person_count} {result.person_count === 1 ? "person" : "people"}.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="pt-4">
          <Button
            onClick={handleSubmit}
            disabled={isLoading || (activeTab === 'file' && !file) || (activeTab === 'url' && !imageUrl)}
          >
            {isLoading ? "Processing..." : "Start Detection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}