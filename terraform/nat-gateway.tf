resource "aws_nat_gateway" "ttt_nat_gateway" {
  allocation_id = aws_eip.ttt_nat_eip.id
  subnet_id     = aws_subnet.public_subnet_1.id

  tags = {
    Name = "ttt_nat_gateway"
  }
}

resource "aws_eip" "ttt_nat_eip" {
  domain = "vpc"

  tags = {
    Name = "ttt_nat_eip"
  }
}
