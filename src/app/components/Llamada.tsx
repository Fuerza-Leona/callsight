import Link from "next/link";
import Tag from "./Tag";
import { Timestamp } from "firebase/firestore";

interface llamadaProps {
  nombre: string;
  startTime: Timestamp;
}

export default function Llamada(props: llamadaProps) {
  return (
    <div>
      <Link href={"./llamada"}>
        <div className="flex w-full justify-center md:justify-between text-center items-center p-2">
          <p className="w-1/3">{props.nombre}</p>
          <p className="w-1/3">{new Date(props.startTime.toString()).toLocaleDateString()}</p>
          <div className="flex w-1/3 gap-2">
            <Tag text="Tecnología"></Tag>
            <Tag text="Marketing"></Tag>
          </div>
        </div>
      </Link>
    </div>
  );
}
