"use client";
import React, { useState, createContext, useContext } from "react";
import { Menu, X } from "lucide-react";

export const SidebarContext = createContext(null);

export function SidebarProvider({ children, sidebar }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
            <div className="flex h-screen bg-white overflow-hidden font-sans relative w-full">
                {/* Mobile Overlay */}
                {isOpen && (
                    <div
                        onClick={() => setIsOpen(false)}
                        aria-hidden
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity md:hidden cursor-pointer"
                    />
                )}
                
                {/* Sidebar Component with Context Control */}
                {React.cloneElement(sidebar, { isOpen, setIsOpen })}

                <div className="flex flex-1 flex-col overflow-hidden w-full relative z-0">
                    {children}
                </div>
            </div>
        </SidebarContext.Provider>
    );
}

export default function SidebarTrigger() {
    const { isOpen, setIsOpen } = useContext(SidebarContext);
    return (
        <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            aria-expanded={!!isOpen}
            aria-controls="dashboard-sidebar-nav"
            className="md:hidden p-2 bg-gray-50 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all cursor-pointer active:scale-95 border border-gray-200 shadow-sm"
        >
            {isOpen ? <X className="w-[18px] h-[18px]" /> : <Menu className="w-[18px] h-[18px]" />}
        </button>
    );
}
