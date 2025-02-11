/*
  Warnings:

  - The primary key for the `Deck` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_deckId_fkey";

-- AlterTable
ALTER TABLE "Card" ALTER COLUMN "deckId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Deck" DROP CONSTRAINT "Deck_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Deck_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Deck_id_seq";

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE CASCADE ON UPDATE CASCADE;
