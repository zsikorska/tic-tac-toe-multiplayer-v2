resource "aws_route_table" "ttt_public_route_table" {
  vpc_id = aws_vpc.ttt_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.ttt_igw.id
  }

  tags = {
    Name = "ttt_public_route_table"
  }
}

resource "aws_route_table_association" "ttt_public_subnet_1_association" {
  subnet_id      = aws_subnet.public_subnet_1.id
  route_table_id = aws_route_table.ttt_public_route_table.id
}

resource "aws_route_table_association" "ttt_public_subnet_2_association" {
  subnet_id      = aws_subnet.public_subnet_2.id
  route_table_id = aws_route_table.ttt_public_route_table.id
}

resource "aws_route_table" "ttt_private_route_table" {
  vpc_id = aws_vpc.ttt_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.ttt_nat_gateway.id
  }

  tags = {
    Name = "ttt_private_route_table"
  }
}

resource "aws_route_table_association" "ttt_private_subnet_1_association" {
  subnet_id      = aws_subnet.private_subnet_1.id
  route_table_id = aws_route_table.ttt_private_route_table.id
}

resource "aws_route_table_association" "ttt_private_subnet_2_association" {
  subnet_id      = aws_subnet.private_subnet_2.id
  route_table_id = aws_route_table.ttt_private_route_table.id
}
