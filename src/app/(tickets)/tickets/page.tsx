import SelectableCheckboxList from '@/components/SelectableCheckboxList'
import React from 'react'

const Tickets = () => {
  const ticketItems = [
    { id: 1, label: 'Support Ticket 1', daysOpen: 3, text: "id aute tempor nostrud esse" },
    { id: 2, label: 'Support Ticket 2', daysOpen: 3, text: "proident aliquip magna duis" },
    { id: 5, label: 'Support Ticket 3', daysOpen: 3, text: "aute cupidatat qui et quis fugiat" },
    { id: 3, label: 'Support Ticket 4', daysOpen: 3, text: "nulla sunt ea proident adipisicing" },
  ];

  return (
    <div className="md:relative absolute w-full min-h-screen flex flex-col justify-center lg:pl-[256px] pt-[140px] md:pt-28 lg:pt-[65px]">
        <div className="w-full text-start">
          <div className="text-white text-4xl text-start">
            <p className="bg-[#13202A] rounded-2xl mx-20 p-8">Proyecto 1</p>
          </div>
      </div>
      <div className='w-full flex'>
        <div className='flex flex-col justify-center text-center items-center'>
          <button className='bg-[#13202A] rounded-lg text-white py-2 px-14 my-10'>
            Abrir nuevo ticket
          </button>
          <SelectableCheckboxList items={ticketItems} />
        </div>
        <div className='flex flex-col'>
          
        </div>
      </div>
    </div>
  )
}

export default Tickets