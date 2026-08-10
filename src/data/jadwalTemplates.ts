import { TemplateJadwal } from '../types';

export const defaultJadwalTemplates: TemplateJadwal[] = [
  {
    id: 'tpl-sd12-rotasi',
    program: 'SD 1-2',
    sistem: 'Rotasi',
    bulanBerlaku: [1, 2, 4, 6],
    mingguan: {
      '1': { senin: 'Matematika', kamis: 'Matematika', selasa: 'Bahasa Indonesia', jumat: 'Bahasa Indonesia', rabu: 'Pendidikan Pancasila', sabtu: 'Pendidikan Pancasila' },
      '2': { senin: 'Matematika', kamis: 'Matematika', selasa: 'Bahasa Inggris', jumat: 'Bahasa Inggris', rabu: 'Bahasa Indonesia', sabtu: 'Bahasa Indonesia' },
      '3': { senin: 'Pendidikan Pancasila', kamis: 'Pendidikan Pancasila', selasa: 'Matematika', jumat: 'Matematika', rabu: 'Bahasa Inggris', sabtu: 'Bahasa Inggris' },
      '4': { senin: 'Bahasa Indonesia', kamis: 'Bahasa Indonesia', selasa: 'Pendidikan Pancasila', jumat: 'Pendidikan Pancasila', rabu: 'Matematika', sabtu: 'Matematika' }
    }
  },
  {
    id: 'tpl-sd12-blok',
    program: 'SD 1-2',
    sistem: 'Blok',
    bulanBerlaku: [3, 5],
    mingguan: {
      '1': { senin: 'Bahasa Indonesia', kamis: 'Bahasa Indonesia', selasa: 'Bahasa Indonesia', jumat: 'Bahasa Indonesia', rabu: 'Bahasa Indonesia', sabtu: 'Bahasa Indonesia' },
      '2': { senin: 'Matematika', kamis: 'Matematika', selasa: 'Matematika', jumat: 'Matematika', rabu: 'Matematika', sabtu: 'Matematika' },
      '3': { senin: 'Pendidikan Pancasila', kamis: 'Pendidikan Pancasila', selasa: 'Pendidikan Pancasila', jumat: 'Pendidikan Pancasila', rabu: 'Pendidikan Pancasila', sabtu: 'Pendidikan Pancasila' },
      '4': { senin: 'Matematika', kamis: 'Matematika', selasa: 'Bahasa Inggris', jumat: 'Bahasa Inggris', rabu: 'Bahasa Inggris', sabtu: 'Bahasa Inggris' }
    }
  },
  {
    id: 'tpl-sd36-rotasi',
    program: 'SD 3-6',
    sistem: 'Rotasi',
    bulanBerlaku: [1, 2, 4, 6],
    mingguan: {
      '1': { senin: 'Matematika', kamis: 'Matematika', selasa: 'Bahasa Indonesia', jumat: 'Bahasa Indonesia', rabu: 'IPAS', sabtu: 'IPAS' },
      '2': { senin: 'Pendidikan Pancasila', kamis: 'Pendidikan Pancasila', selasa: 'Matematika', jumat: 'Matematika', rabu: 'Bahasa Inggris', sabtu: 'Bahasa Inggris' },
      '3': { senin: 'Bahasa Indonesia', kamis: 'Bahasa Indonesia', selasa: 'IPAS', jumat: 'IPAS', rabu: 'Matematika', sabtu: 'Matematika' },
      '4': { senin: 'Pendidikan Pancasila', kamis: 'Pendidikan Pancasila', selasa: 'Bahasa Inggris', jumat: 'Bahasa Inggris', rabu: 'Bahasa Indonesia', sabtu: 'Bahasa Indonesia' }
    }
  },
  {
    id: 'tpl-sd36-blok',
    program: 'SD 3-6',
    sistem: 'Blok',
    bulanBerlaku: [3, 5],
    mingguan: {
      '1': { senin: 'Bahasa Indonesia', kamis: 'Bahasa Indonesia', selasa: 'Bahasa Indonesia', jumat: 'Bahasa Indonesia', rabu: 'Bahasa Indonesia', sabtu: 'Bahasa Indonesia' },
      '2': { senin: 'Matematika', kamis: 'Matematika', selasa: 'Matematika', jumat: 'Matematika', rabu: 'Matematika', sabtu: 'Matematika' },
      '3': { senin: 'IPAS', kamis: 'IPAS', selasa: 'IPAS', jumat: 'IPAS', rabu: 'Pendidikan Pancasila', sabtu: 'Pendidikan Pancasila' },
      '4': { senin: 'Pendidikan Pancasila', kamis: 'Pendidikan Pancasila', selasa: 'Bahasa Inggris', jumat: 'Bahasa Inggris', rabu: 'Bahasa Inggris', sabtu: 'Bahasa Inggris' }
    }
  },
  {
    id: 'tpl-smp7a-rotasi',
    program: 'SMP 7A',
    sistem: 'Rotasi',
    bulanBerlaku: [1, 2, 4, 6],
    mingguan: {
      '1': { senin: 'Matematika', selasa: 'IPA', rabu: 'Bahasa Indonesia' },
      '2': { senin: 'Bahasa Inggris', selasa: 'Matematika', rabu: 'IPA' },
      '3': { senin: 'IPA', selasa: 'Bahasa Indonesia', rabu: 'Bahasa Inggris' },
      '4': { senin: 'Bahasa Indonesia', selasa: 'Bahasa Inggris', rabu: 'Matematika' }
    }
  },
  {
    id: 'tpl-smp7a-blok',
    program: 'SMP 7A',
    sistem: 'Blok',
    bulanBerlaku: [3, 5],
    mingguan: {
      '1': { senin: 'Bahasa Indonesia', selasa: 'Bahasa Indonesia', rabu: 'Bahasa Indonesia' },
      '2': { senin: 'IPA', selasa: 'IPA', rabu: 'IPA' },
      '3': { senin: 'Bahasa Inggris', selasa: 'Bahasa Inggris', rabu: 'Bahasa Inggris' },
      '4': { senin: 'Matematika', selasa: 'Matematika', rabu: 'Matematika' }
    }
  },
  {
    id: 'tpl-smp7b-rotasi',
    program: 'SMP 7B',
    sistem: 'Rotasi',
    bulanBerlaku: [1, 2, 4, 6],
    mingguan: {
      '1': { senin: 'IPA', selasa: 'Bahasa Inggris', rabu: 'Matematika' },
      '2': { senin: 'Matematika', selasa: 'Bahasa Indonesia', rabu: 'Bahasa Inggris' },
      '3': { senin: 'Bahasa Inggris', selasa: 'Matematika', rabu: 'IPA' },
      '4': { senin: 'Bahasa Indonesia', selasa: 'IPA', rabu: 'Bahasa Indonesia' }
    }
  },
  {
    id: 'tpl-smp7b-blok',
    program: 'SMP 7B',
    sistem: 'Blok',
    bulanBerlaku: [3, 5],
    mingguan: {
      '1': { senin: 'Bahasa Indonesia', selasa: 'Bahasa Indonesia', rabu: 'Bahasa Indonesia' },
      '2': { senin: 'IPA', selasa: 'IPA', rabu: 'IPA' },
      '3': { senin: 'Bahasa Inggris', selasa: 'Bahasa Inggris', rabu: 'Bahasa Inggris' },
      '4': { senin: 'Matematika', selasa: 'Matematika', rabu: 'Matematika' }
    }
  },
  {
    id: 'tpl-smp8-rotasi',
    program: 'SMP 8',
    sistem: 'Rotasi',
    bulanBerlaku: [1, 2, 4, 6],
    mingguan: {
      '1': { senin: 'Bahasa Indonesia', selasa: 'Matematika', rabu: 'Bahasa Inggris' },
      '2': { senin: 'IPA', selasa: 'Bahasa Inggris', rabu: 'Bahasa Indonesia' },
      '3': { senin: 'Matematika', selasa: 'IPA', rabu: 'Bahasa Indonesia' },
      '4': { senin: 'Bahasa Inggris', selasa: 'Matematika', rabu: 'IPA' }
    }
  },
  {
    id: 'tpl-smp8-blok',
    program: 'SMP 8',
    sistem: 'Blok',
    bulanBerlaku: [3, 5],
    mingguan: {
      '1': { senin: 'Bahasa Inggris', selasa: 'Bahasa Inggris', rabu: 'Bahasa Inggris' },
      '2': { senin: 'Matematika', selasa: 'Matematika', rabu: 'Matematika' },
      '3': { senin: 'Bahasa Indonesia', selasa: 'Bahasa Indonesia', rabu: 'Bahasa Indonesia' },
      '4': { senin: 'IPA', selasa: 'IPA', rabu: 'IPA' }
    }
  },
  {
    id: 'tpl-smp9-rotasi',
    program: 'SMP 9',
    sistem: 'Rotasi',
    bulanBerlaku: [1, 2, 4, 6],
    mingguan: {
      '1': { senin: 'Bahasa Inggris', selasa: 'Bahasa Indonesia', rabu: 'IPA' },
      '2': { senin: 'Bahasa Indonesia', selasa: 'IPA', rabu: 'Matematika' },
      '3': { senin: 'Matematika', selasa: 'Bahasa Inggris', rabu: 'Matematika' },
      '4': { senin: 'IPA', selasa: 'Bahasa Indonesia', rabu: 'Bahasa Inggris' }
    }
  },
  {
    id: 'tpl-smp9-blok',
    program: 'SMP 9',
    sistem: 'Blok',
    bulanBerlaku: [3, 5],
    mingguan: {
      '1': { senin: 'Bahasa Inggris', selasa: 'Bahasa Inggris', rabu: 'Bahasa Inggris' },
      '2': { senin: 'Matematika', selasa: 'Matematika', rabu: 'Matematika' },
      '3': { senin: 'Bahasa Indonesia', selasa: 'Bahasa Indonesia', rabu: 'Bahasa Indonesia' },
      '4': { senin: 'IPA', selasa: 'IPA', rabu: 'IPA' }
    }
  },
  {
    id: 'tpl-tk-rotasi',
    program: 'TK',
    sistem: 'Rotasi',
    bulanBerlaku: [1, 2, 3, 4, 5, 6],
    mingguan: {
      '1': { senin: 'Membaca, Menulis, Berhitung, Science & English', selasa: 'Membaca, Menulis, Berhitung, Science & English', rabu: 'Membaca, Menulis, Berhitung, Science & English', kamis: 'Membaca, Menulis, Berhitung, Science & English', jumat: 'Membaca, Menulis, Berhitung, Science & English', sabtu: 'Membaca, Menulis, Berhitung, Science & English' },
      '2': { senin: 'Membaca, Menulis, Berhitung, Science & English', selasa: 'Membaca, Menulis, Berhitung, Science & English', rabu: 'Membaca, Menulis, Berhitung, Science & English', kamis: 'Membaca, Menulis, Berhitung, Science & English', jumat: 'Membaca, Menulis, Berhitung, Science & English', sabtu: 'Membaca, Menulis, Berhitung, Science & English' },
      '3': { senin: 'Membaca, Menulis, Berhitung, Science & English', selasa: 'Membaca, Menulis, Berhitung, Science & English', rabu: 'Membaca, Menulis, Berhitung, Science & English', kamis: 'Membaca, Menulis, Berhitung, Science & English', jumat: 'Membaca, Menulis, Berhitung, Science & English', sabtu: 'Membaca, Menulis, Berhitung, Science & English' },
      '4': { senin: 'Membaca, Menulis, Berhitung, Science & English', selasa: 'Membaca, Menulis, Berhitung, Science & English', rabu: 'Membaca, Menulis, Berhitung, Science & English', kamis: 'Membaca, Menulis, Berhitung, Science & English', jumat: 'Membaca, Menulis, Berhitung, Science & English', sabtu: 'Membaca, Menulis, Berhitung, Science & English' }
    }
  }
];
