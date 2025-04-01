import Link from "next/link";
import Tag from "./Tag";

interface llamadaProps{
    nombre: string
}

export const Llamada = (props : llamadaProps) => {
    return (
        <Link href={"./llamada"}>
            <div className="flex w-full justify-center md:justify-between text-center items-center p-2">
                <p className="w-1/3">{props.nombre}</p>
                <p className="w-1/3">19/02/2025</p>
                <div className="flex w-1/3 gap-2">
                    <Tag text="Tecnología"></Tag>
                    <Tag text="Marketing"></Tag>
                </div>
            </div>
        </Link>
    );
};
