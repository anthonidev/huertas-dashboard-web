"use server";
import { httpClient } from "@/lib/api/http-client";
import { ResponseLeads } from "@/types/lead/lead.types";

export async function getLeads(
  params?: Record<string, unknown> | undefined
): Promise<ResponseLeads> {
  try {
    return await httpClient<ResponseLeads>("/api/web/leadweb/", {
      params,
    });
  } catch (error) {
    console.error("Error al obtener leads:", error);
    throw error;
  }
}
