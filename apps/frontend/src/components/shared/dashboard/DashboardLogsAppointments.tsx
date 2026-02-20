import { CalendarDays, ChevronRight, Clock3, Stethoscope } from 'lucide-react';
import * as React from 'react';
import { Link } from 'react-router-dom';


export type AppointmentLogStatus = "confirmada" | "seguimiento" | "prioritaria";

export type DashboardAppointmentLog = {
    id: string;
    date: string;
    time?: string;
    patientName: string;
    diagnosis: string;
    status: AppointmentLogStatus;
    url: string;
};

const statusClassByType: Record<AppointmentLogStatus, string> = {
    confirmada: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]",
    seguimiento: "bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]",
    prioritaria: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]",
};

type DashboardLogsAppointmentsProps = {
    logs: DashboardAppointmentLog[];
};

export const DashboardLogsAppointments: React.FC<DashboardLogsAppointmentsProps> = ({ logs }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            {logs.map((appointment) => {
                const [dateText, timeText] = appointment.date.split(" - ");
                const appointmentTime = appointment.time || timeText;

                return (
                    <Link
                        key={appointment.id}
                        to={appointment.url}
                        className="group flex items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex gap-4 items-start">
                            <div
                                className={`mt-1 w-2.5 h-2.5 rounded-full ${statusClassByType[appointment.status]}`}
                            ></div>
                            <div>
                                <p className="text-sm font-medium text-[var(--brand-primario)]">
                                    {appointment.patientName}
                                </p>
                                <p className="text-xs text-gray-600 inline-flex items-center gap-1.5">
                                    <Stethoscope className="size-3.5 text-gray-500" />
                                    Motivo / diagnostico: {appointment.diagnosis}
                                </p>
                                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                                    <span className="inline-flex items-center gap-1.5">
                                        <CalendarDays className="size-3.5 text-gray-500" />
                                        Fecha: {dateText || appointment.date}
                                    </span>
                                    {appointmentTime ? (
                                        <span className="inline-flex items-center gap-1.5">
                                            <Clock3 className="size-3.5 text-gray-500" />
                                            Hora: {appointmentTime}
                                        </span>
                                    ) : null}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-xs text-[var(--brand-secundario)] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                                Ver detalle
                            </span>
                            <ChevronRight className="size-4 text-[var(--brand-secundario)] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};
