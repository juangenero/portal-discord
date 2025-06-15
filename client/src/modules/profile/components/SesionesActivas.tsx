import { useAuth } from '@/modules/auth/AuthContext';
import { deleteSessionApi, getSessionsApi } from '@/services/api.service';
import { LocationIcon, TrashIcon, WindowIcon } from '@/shared/components/Icons';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from '@heroui/react';
import { useEffect, useState } from 'react';

function SesionesActivas() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getSessions();
  }, []);

  async function getSessions() {
    const sessions = (await getSessionsApi()).data;
    // console.debug(sessions);
    const sortedSessions = sessions.sort(
      (a: any, b: any) =>
        new Date(b.fechaActualizacion).getTime() - new Date(a.fechaActualizacion).getTime()
    );

    setIsLoading(false);
    setSessions(sortedSessions);
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(date);
    const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day} ${capitalizedMonth}, ${hours}:${minutes}`;
  }

  async function eliminarSesion(id: string) {
    await deleteSessionApi(id);
    getSessions();
  }

  const columns = [
    {
      key: 'system',
      label: 'SISTEMA',
    },
    {
      key: 'ip',
      label: 'IP',
    },
    {
      key: 'browser',
      label: 'NAVEGADOR',
    },
    {
      key: 'location',
      label: 'UBICACIÓN',
    },
    {
      key: 'update',
      label: 'ÚLTIMA ACTIVIDAD',
    },
    {
      key: 'actions',
      label: 'ACCIONES',
    },
  ];

  return (
    <Table aria-label="Sesiones activas">
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody
        items={sessions}
        isLoading={isLoading}
        loadingContent={<Spinner variant="gradient" />}
      >
        {(sesion: any) => (
          <TableRow key={sesion.id}>
            {/* SISTEMA */}
            <TableCell>
              <div className="flex items-center gap-2">
                {sesion.deviceInfo.sistemaOperativo === 'Windows' ? <WindowIcon size={16} /> : null}
                {sesion.deviceInfo.sistemaOperativo}
              </div>
            </TableCell>

            {/* IP */}
            <TableCell>{sesion.deviceInfo.ip}</TableCell>

            {/* NAVEGADOR */}
            <TableCell>{sesion.deviceInfo.navegador}</TableCell>

            {/* UBICACIÓN */}
            <TableCell>
              <div className="flex items-center gap-1">
                <LocationIcon size={16} />
                {`${sesion.deviceInfo.ciudad ?? sesion.deviceInfo.ciudad}`}
                {sesion.deviceInfo.region ? ', ' + sesion.deviceInfo.region : undefined}
                {sesion.deviceInfo.pais ? ', ' + sesion.deviceInfo.pais : undefined}
              </div>
            </TableCell>

            {/* ÚLTIMA ACTUALIZACIÓN */}
            <TableCell>{formatDate(sesion.fechaActualizacion)}</TableCell>

            {/* ACCIONES */}
            <TableCell className="flex justify-center">
              {user?.idSesion === sesion.id ? (
                <Popover placement="top">
                  <PopoverTrigger>
                    <div>
                      <TrashIcon size={20} color="gray" className="cursor-pointer" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="px-1 py-2">
                      <div className="font-extrabold">Esta es tu sesión actual</div>
                      <div>Puedes cerrarla desde el menú de usuario</div>
                    </div>
                  </PopoverContent>
                </Popover>
              ) : (
                <Tooltip content="Eliminar sesión" placement="top">
                  <span className="text-lg text-danger cursor-pointer active:opacity-50">
                    <TrashIcon
                      size={20}
                      color="danger"
                      onClick={async () => {
                        await eliminarSesion(sesion.id);
                      }}
                    />
                  </span>
                </Tooltip>
              )}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default SesionesActivas;
