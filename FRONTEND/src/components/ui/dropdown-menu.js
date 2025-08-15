import React, { useState } from "react";

export const DropdownMenu = ({ children }) => <div>{children}</div>;
export const DropdownMenuTrigger = ({ children }) => <div>{children}</div>;
export const DropdownMenuContent = ({ children }) => <div className="absolute bg-white border rounded shadow">{children}</div>;
export const DropdownMenuItem = ({ children, ...props }) => <div className="px-3 py-2 hover:bg-gray-100 cursor-pointer" {...props}>{children}</div>;
