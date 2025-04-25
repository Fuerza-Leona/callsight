'use client';
import MultilineTextFields from '@/components/MultilineTextFields';
import SelectableCheckboxList from '@/components/SelectableCheckboxList';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Tickets = () => {
  const [textFieldHeight, setTextFieldHeight] = useState(500);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = 500;
      const scrollY = window.scrollY;
      const newHeight = 500 + Math.min(200, (scrollY / maxScroll) * 200); // max 700
      setTextFieldHeight(newHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const ticketItems = [
    {
      id: 1,
      label: 'irure dolore eiusmod',
      daysOpen: 1,
      text: 'Incididunt voluptate velit nostrud pariatur. Adipisicing ea non duis velit officia mollit non est cillum nisi mollit aliqua ex. Quis eiusmod tempor duis nisi. Aliqua nulla ullamco mollit id mollit ad fugiat.',
    },
    {
      id: 2,
      label: 'mollit fugiat',
      daysOpen: 2,
      text: 'Culpa aliquip do officia quis consequat excepteur aliqua commodo adipisicing eiusmod dolore non voluptate et.',
    },
    {
      id: 5,
      label: 'do enim sit dolor',
      daysOpen: 5,
      text: 'Cupidatat laborum eu labore quis non nostrud esse esse do fugiat voluptate. Ipsum consectetur nulla aliquip deserunt cillum. Sit ut Lorem sunt do. Qui in est exercitation irure amet. Id sunt et nisi nisi duis occaecat aliquip enim do incididunt consectetur sit duis cillum.',
    },
    {
      id: 3,
      label: 'adipisicing officia quis',
      daysOpen: 3,
      text: 'Dolore ut et dolor ex Lorem cupidatat irure ullamco id irure exercitation. Irure dolor laborum sint non laborum aliquip.',
    },
    {
      id: 7,
      label: 'excepteur sunt laborum',
      daysOpen: 8,
      text: 'Excepteur laborum commodo culpa incididunt esse nisi exercitation. Ullamco cillum ex ut voluptate mollit.',
    },
    {
      id: 6,
      label: 'veniam esse reprehenderit',
      daysOpen: 6,
      text: 'Veniam reprehenderit elit excepteur id pariatur magna veniam esse. Enim veniam nulla deserunt occaecat.',
    },
    {
      id: 9,
      label: 'laboris nostrud',
      daysOpen: 4,
      text: 'Laboris nostrud ad pariatur excepteur dolor. Do veniam id ex elit.',
    },
    {
      id: 10,
      label: 'nisi amet officia',
      daysOpen: 9,
      text: 'Amet occaecat deserunt irure nisi ex. Non amet voluptate enim id nisi sint officia deserunt.',
    },
    {
      id: 4,
      label: 'reprehenderit in nulla',
      daysOpen: 7,
      text: 'Reprehenderit nisi deserunt in nulla. Dolor sint nostrud anim incididunt est ullamco.',
    },
    {
      id: 8,
      label: 'elit in sint ad',
      daysOpen: 10,
      text: 'Sint velit ullamco officia incididunt amet. Elit fugiat irure sunt mollit in.',
    },
    {
      id: 11,
      label: 'culpa magna nulla',
      daysOpen: 11,
      text: 'Culpa magna nulla ex eiusmod pariatur sint fugiat. Aute ullamco consectetur qui enim est.',
    },
    {
      id: 12,
      label: 'ea in laborum',
      daysOpen: 12,
      text: 'Ea in laborum nostrud officia dolore. Laboris cupidatat culpa aute mollit.',
    },
    {
      id: 13,
      label: 'ullamco deserunt veniam',
      daysOpen: 13,
      text: 'Ullamco deserunt veniam laborum duis sit ex. Pariatur qui nisi consequat id sint ad nulla.',
    },
    {
      id: 14,
      label: 'proident amet do',
      daysOpen: 14,
      text: 'Proident amet do laborum aliqua pariatur laborum. Sint ad in ex sint amet veniam.',
    },
    {
      id: 15,
      label: 'adipisicing veniam',
      daysOpen: 15,
      text: 'Adipisicing veniam cillum est exercitation esse. Ad occaecat irure eiusmod do exercitation.',
    },
    {
      id: 16,
      label: 'incididunt excepteur',
      daysOpen: 16,
      text: 'Incididunt excepteur tempor laboris aliqua labore fugiat mollit. Duis veniam cupidatat sint incididunt laborum.',
    },
    {
      id: 17,
      label: 'occaecat sint cupidatat',
      daysOpen: 17,
      text: 'Occaecat sint cupidatat ad esse. Consequat anim minim culpa sint aliqua incididunt.',
    },
    {
      id: 18,
      label: 'dolore aute nulla',
      daysOpen: 18,
      text: 'Dolore aute nulla fugiat deserunt. Laborum sint dolor sint occaecat ex ad voluptate sunt.',
    },
    {
      id: 19,
      label: 'anim eiusmod ad',
      daysOpen: 19,
      text: 'Anim eiusmod ad duis commodo ad fugiat nulla exercitation dolore. Veniam nisi labore mollit.',
    },
    {
      id: 20,
      label: 'amet minim ullamco',
      daysOpen: 20,
      text: 'Amet minim ullamco dolor reprehenderit eiusmod laboris. Magna reprehenderit dolor duis occaecat incididunt velit laborum pariatur.',
    },
  ];

  return (
    <div className="relative w-full min-h-screen flex flex-col lg:pl-[256px] pt-[140px] md:pt-28 lg:pt-[150px]">
      {/* 🔙 Botón de Regresar */}
      <div className="pl-3">
        <button
          className="bg-[#13202A] text-white px-4 py-2 rounded-lg hover:bg-[#1b2c3d]"
          onClick={() => router.push('/companies')}
        >
          ← Regresar
        </button>
      </div>

      {/* 🧾 Título centrado */}
      <div className="w-full text-center">
        <div className="bg-[#13202A] rounded-2xl mx-20 p-8 inline-block">
          <p className="text-white text-4xl font-semibold">
            Portal de Soporte para Cemex
          </p>
        </div>
      </div>

      <div className="w-full flex justify-between">
        <div className="flex flex-col justify-center items-center px-2">
          <button className="bg-[#13202A] rounded-lg text-white py-2 px-30 my-10 hover:cursor-pointer">
            Abrir nuevo ticket
          </button>
          <div className="flex border-gray-400 border w-full justify-between px-5 mx-10">
            <button>Tickets abiertos (14) ⌄</button>
            <button>Orden ⌄</button>
          </div>
          <SelectableCheckboxList
            items={[...ticketItems].sort((a, b) => a.id - b.id)}
          />
        </div>

        {/* Área del campo de texto */}
        <div
          className="flex flex-col justify-end items-end w-[55rem] fixed bottom-10 right-10"
          style={{
            height: `${textFieldHeight}px`,
            transition: 'height 0.02s ease-in-out',
          }}
        >
          <MultilineTextFields
            label="Titulo"
            sx={{ width: 'calc(100% - 5rem)', height: '75%' }}
          />
          <button className="ml-auto bg-[#F6CF3C] rounded-xl px-4 py-2 mr-10 mt-2 hover:cursor-pointer">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tickets;
