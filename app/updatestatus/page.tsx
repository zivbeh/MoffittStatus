"use client";

import Link from "next/link";


import { AiOutlineInstagram } from "react-icons/ai";
import { AcademicCapIcon } from "@heroicons/react/24/outline";
import { Slider } from "@/components/ui/slider";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

interface FormMessageProps {
  error?: string;
}

const FormMessage: React.FC<FormMessageProps> = ({ error }) => (
  <p className="text-red-500 text-sm mt-1">{error}</p>
);

const formSchema = z.object({
  libraryName: z.enum(["Moffitt Library", "Doe Library", "Haas Library", "Main Stacks"], {
    required_error: "Please select a library.",
  }),
  floor: z
    .enum(["Floor 1", "Floor 2", "Floor 3", "Floor 4", "Floor 5"])
    .optional()
    .nullable(),
  busyScale: z.enum(["1", "2", "3", "4", "5"], {
    required_error: "Please provide a valid busy scale.",
  }),
  updatedBy: z
    .string()
    .max(255, "Must be 255 characters or less.")
    .nonempty("Please enter your name or @."),
});

const UpdateForm = () => {
  const methods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      libraryName: "Moffitt Library",
      floor: "Floor 1",
      busyScale: "3",
      updatedBy: "Anonymous",
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const selectedLibrary = useWatch({
    control: methods.control,
    name: "libraryName",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const currentTime = new Date().toISOString();

    // For Haas, Doe, and Main Stacks Libraries, set floor to null
    if (values.libraryName !== "Moffitt Library") {
      values.floor = null;
    }
    console.log(currentTime)
    const dataToSubmit = {
      ...values,
      createdAt: currentTime,
    };

    const res = await fetch("/api/saveData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSubmit),
    });
    console.log(dataToSubmit);
    if (res.ok) {
      alert("Data saved successfully!");
    } else {
      alert("Failed to save data.");
    }
  }

  return (
    <div className="container mx-auto px-4 py-10 bg-white">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <Link href="/" className="flex items-center">
          <AcademicCapIcon className="h-10 w-10 mr-4 transition-transform duration-300 hover:scale-110 bg-gradient-to-r from-black to-white bg-clip-text" />
          <h1 className="text-3xl font-bold transition-transform duration-300 hover:scale-105">
            MoffittStatus
          </h1>
          </Link>
        </div>
        <a
          href="https://www.instagram.com/moffittstatus"
          target="_blank"
          rel="noopener noreferrer"
          className="text-4xl text-purple-500 hover:text-pink-500 hover:scale-110 transition-transform duration-300"
        >
          <AiOutlineInstagram />
        </a>
      </div>

      {/* Thin Divider */}
      <div className="w-full h-[1px] bg-gray-300 mb-8"></div>

      {/* Form Section */}
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-20 space-y-6 bg-white shadow-md p-6 rounded-lg max-w-lg w-full mx-auto"
        >
          {/* Library Field */}
          <FormField
            control={methods.control}
            name="libraryName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Library</FormLabel>
                <FormControl>
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {["Moffitt Library", "Doe Library", "Haas Library", "Main Stacks"].map(
                      (libraryName) => (
                        <Button
                          key={libraryName}
                          type="button"
                          className={`px-4 py-2 rounded-md transition-all duration-300 ${
                            field.value === libraryName
                              ? "bg-gray-700 text-white"
                              : "bg-gray-300 text-black hover:bg-gray-400"
                          }`}
                          onClick={() => field.onChange(libraryName)}
                        >
                          {libraryName}
                        </Button>
                      )
                    )}
                  </div>
                </FormControl>
                <FormMessage error={errors.libraryName?.message} />
              </FormItem>
            )}
          />

          {/* Conditionally Render Floor Field */}
          {selectedLibrary === "Moffitt Library" && (
            <FormField
              control={methods.control}
              name="floor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What floor are you on?</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap justify-center gap-2 mt-2">
                      {["Floor 1", "Floor 3", "Floor 4", "Floor 5"].map(
                        (floorLabel) => (
                          <Button
                            key={floorLabel}
                            type="button"
                            className={`px-4 py-2 rounded-md transition-all duration-300 ${
                              field.value === floorLabel
                                ? "bg-gray-700 text-white"
                                : "bg-gray-300 text-black hover:bg-gray-400"
                            }`}
                            onClick={() => field.onChange(floorLabel)}
                          >
                            {floorLabel}
                          </Button>
                        )
                      )}
                    </div>
                  </FormControl>
                  <FormMessage error={errors.floor?.message} />
                </FormItem>
              )}
            />
          )}

          {/* Busy Scale Field */}
          <FormField
            control={methods.control}
            name="busyScale"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How busy is it? (1-5)</FormLabel>
                <FormControl>
                  <div className="flex flex-col items-center">
                    <Slider
                      value={[Number(field.value)]}
                      min={1}
                      max={5}
                      step={1}
                      defaultValue={[3]}
                      onValueChange={(value) =>
                        field.onChange(String(value[0]))
                      }
                      className="w-full"
                    />
                    <div className="mt-2 text-sm text-gray-600 text-center">
                      <strong>Status:</strong>{" "}
                      {Number(field.value) === 1 && "Wide Open"}
                      {Number(field.value) === 2 && "Not Too Busy"}
                      {Number(field.value) === 3 && "Kinda Busy"}
                      {Number(field.value) === 4 && "Very Busy"}
                      {Number(field.value) === 5 && "Extremely Busy"}
                    </div>
                  </div>
                </FormControl>
                <FormMessage error={errors.busyScale?.message} />
              </FormItem>
            )}
          />

          {/* Updated By Field */}
          <FormField
            control={methods.control}
            name="updatedBy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Name</FormLabel>
                <FormControl>
                  <input
                    type="text"
                    {...field}
                    maxLength={255}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </FormControl>
                <FormMessage error={errors.updatedBy?.message} />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors duration-300"
          >
            Submit
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default UpdateForm;
