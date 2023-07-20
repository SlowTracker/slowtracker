import { NextResponse } from "next/server";

export type Project = {
  id: string;
  title: string;
  description: string;
};

const getProjectsStatic = (): Project[] => {
  return [];
};

export async function GET(request: Request) {
  const projects = getProjectsStatic();
  return NextResponse.json(projects);
}
