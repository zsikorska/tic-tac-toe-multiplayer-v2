resource "aws_internet_gateway" "ttt_igw" {
  vpc_id = aws_vpc.ttt_vpc.id

  tags = {
    Name = "ttt_igw"
  }
}
