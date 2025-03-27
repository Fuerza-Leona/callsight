"use client";

import * as React from 'react';
import Link from 'next/link';
import Tag from '../components/Tag';
import MultipleSelectChip from '../components/MultipleSelectChip';

const namesPeople = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

const namesClientes = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

const categorias = [
  'Tecnología',
  'Marketing'
];

export default function Home() {
    return (
        <div className="relative lg:left-64 top-32 w-full xl:w-75/100 min-h-screen flex flex-col md:justify-around md:flex-row gap-2 m-2">
            <div className="w-3/10 flex flex-col align-center text-center">
                <p>Filtros</p>
                <MultipleSelectChip title='Usuarios' names={namesPeople}/>
                <MultipleSelectChip title='Cliente' names={namesClientes}/>
                <MultipleSelectChip title='Categorías' names={categorias}/>
            </div>
            <div className='w-full md:w-[50%] flex flex-col divide-y-1 divide-solid divide-[#D0D0D0]'>
                <p>Buscar</p>
                <Link href={"./llamada"}>
                    <div className='flex w-full justify-center md:justify-between text-center items-center p-2'>
                        <p className='w-1/3'>Llamada 1</p>
                        <p className='w-1/3'>19/02/2025</p>
                        <div className='flex w-1/3 gap-2'>
                            <Tag text='Tecnología'></Tag>
                            <Tag text='Marketing'></Tag>
                        </div>
                    </div>
                </Link>
            </div>
            
        </div>
    );
}
