
import { PrismaClient } from '@prisma/client/extension';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 กำລັງເລີ່ມຕົ້ນ Seed ຂໍ້ມູນລົງ Database...');

    // ລ້າງຂໍ້ມູນເກົ່າອອກກ່ອນ (ລະວັງ: ຖ້າມີຂໍ້ມູນຈິງຢ່າໃຊ້คำສັ່ງນີ້)
    await prisma.payment.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.car.deleteMany();
    await prisma.user.deleteMany();

    // 1. ສ້າງ User ຕົວຢ່າງ (Admin & Staff)
    const hashedPassword = await bcrypt.hash('123456', 10);

    const superAdmin = await prisma.user.create({
        data: {
            name: 'Super Admin',
            email: 'admin@carrental.com',
            password: hashedPassword,
            role: 'SUPER_ADMIN',
        },
    });

    const staff = await prisma.user.create({
        data: {
            name: 'Staff Somchai',
            email: 'staff@carrental.com',
            password: hashedPassword,
            role: 'STAFF',
        },
    });

    console.log('👤 ສ້າງ Users ສຳເລັດ');

    // 2. ສ້າງຂໍ້ມູນລົດ (Cars)
    const car1 = await prisma.car.create({
        data: {
            brand: 'Toyota',
            model: 'Camry',
            plateNumber: 'ກຂ 1234 ວຽງຈັນ',
            status: 'AVAILABLE',
            currentMileage: 15000,
        },
    });

    const car2 = await prisma.car.create({
        data: {
            brand: 'Honda',
            model: 'CR-V',
            plateNumber: 'ຮຮ 5678 ວຽງຈັນ',
            status: 'AVAILABLE',
            currentMileage: 8500,
        },
    });

    console.log('🚗 ສ້າງ Cars ສຳເລັດ');

    // 3. ສ້າງຂໍ້ມູນລູກຄ້າ (Customer)
    const customer = await prisma.customer.create({
        data: {
            fullName: 'John Doe',
            phone: '2022334455',
            idCardOrPassport: 'P12345678',
            driverLicense: 'DL-987654',
            isBlacklisted: false,
        },
    });

    console.log('🧑‍💼 ສ້າງ Customer ສຳເລັດ');

    // 4. ສ້າງຂໍ້ມູນການຈອງ (Booking)
    const booking = await prisma.booking.create({
        data: {
            bookingCode: 'BKG-2026-001',
            customerId: customer.id,
            carId: car1.id,
            staffId: staff.id,
            startDate: new Date(),
            endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // ເຊົ່າ 3 ວັນ
            status: 'CONFIRMED',
            totalAmount: 1500000, // 1,500,000 ກີບ
        },
    });

    console.log('📅 ສ້າງ Booking ສຳເລັດ');

    // 5. ສ້າງຂໍ້ມູນການຊຳລະເງິນ (Payment)
    await prisma.payment.create({
        data: {
            bookingId: booking.id,
            amount: 1500000,
            depositAmount: 500000, // ເງິນມັດຈຳ 500,000 ກີບ
            isDepositRefunded: false,
            method: 'QR_CODE',
            status: 'PAID',
            transactionRef: 'TXN-99887766',
            paidAt: new Date(),
        },
    });

    console.log('💳 ສ້າງ Payment ສຳເລັດ');
    console.log('✨ Seed ຂໍ້ມູນສຳເລັດຮຽບຮ້ອຍແລ້ວ!');
}

main()
    .catch((e) => {
        console.error('❌ ເກີດຂໍ້ຜິດພາດໃນການ Seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });