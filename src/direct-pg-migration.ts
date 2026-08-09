import { Client } from 'pg';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();

async function migrate() {
  // Masalah 'tenant/user ENOTFOUND' terjadi karena Node pg resolver di Linux (atau setting environment internal)
  // mengira 'postgres.tpsqmcziztcdulusiczq' adalah host name karena ada karakter titik (.) di dalamnya jika parsing salah.
  // Untuk memaksa host sesungguhnya ke pooler IP dan mengirim parameter user dengan benar:
  
  const client = new Client({
    host: '54.255.219.82', // IP direct dari aws-0-ap-southeast-1.pooler.supabase.com
    port: 6543,
    user: 'postgres.tpsqmcziztcdulusiczq',
    password: 'iceromancer-----',
    database: 'postgres',
    ssl: {
      rejectUnauthorized: false
    }
  });

  console.log('Menghubungkan ke IP pooler langsung...');
  try {
    await client.connect();
    console.log('Koneksi Postgres Sukses!');
    const sql = fs.readFileSync('/home/rega/ai-content-factory/schema-niche-v2.sql', 'utf-8');
    await client.query(sql);
    console.log('Migrasi Tabel Niches & Config v2 Berhasil Dijalankan!');
  } catch (err: any) {
    console.error('Koneksi database langsung gagal:', err.message);
  } finally {
    await client.end();
  }
}

migrate();
