import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axiosClient from "@/lib/axiosClient";
import toast from "react-hot-toast";

export default function ChangeDataProfile({
    label,
    data,
    keyData
}:{
    label: string,
    data: string,
    keyData: string
}) {
  const [disabled, setDisabled] = useState<boolean>(true);
  const [filed, setFiled] = useState<string|null>(data || null)

  const changeData = async (e: any) => {
    const api = await axiosClient()
    try {
        await api.put("/customer/profile", {
          [keyData] : e
        })
        toast.success("Done")
    } catch (error) {
        toast.error("Error")
    }
  }


  return (
    <div className="space-y-2">
      <Label htmlFor={label.split(' ').join("-")} className="text-xl capitalize">
        {label}
      </Label>
      <div className="flex gap-4">
        <Input
          disabled={disabled}
          id={label.split(' ').join("-")}
          defaultValue={filed || ""}
          onChange={(e) =>
            setFiled(e.target.value)
          }
        />
        {disabled ? (
          <Button
            variant="link"
            className="underline"
            onClick={() =>
              setDisabled((prev) => !prev)
            }
          >
            تغيير
          </Button>
        ) : (
          <Button
            variant="link"
            className="underline"
            onClick={() => changeData(filed)}
          >
            حفظ
          </Button>
        )}
      </div>
    </div>
  );
}
