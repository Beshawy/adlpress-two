"use client";
import AlertApp from "@/components/auth/AlertApp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";

export default function Support() {
  const [isOpen, setIsOpen] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsOpen(true);
  };
  return (
    <div className="min-h-screen text-gray-700 p-6 max-w-2xl space-y-8">
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            placeholder="Technical Issue"
            //   className="bg-black border-gray-800"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            className="min-h-96"
            placeholder="There is a technical issue that happens in homepage every time i use the website
I cant access certain categories , the categories screen freezes"
          />
        </div>
        <div className="mt-7">
          <Button className="w-full">Send a request</Button>
        </div>
      </form>
      <AlertApp
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        msg="Your Request was sent successfully"
        text="Success"
      />
    </div>
  );
}
