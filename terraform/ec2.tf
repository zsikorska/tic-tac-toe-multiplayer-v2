data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"] # Canonical
}

resource "aws_key_pair" "ttt-key" {
  key_name   = "ttt-key"
  public_key = file("C:/Users/sikor/.ssh/ttt-key.pub")
}

resource "aws_instance" "ttt-server" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t2.micro"
  key_name      = aws_key_pair.ttt-key.key_name
  subnet_id     = aws_subnet.public_subnet.id
  vpc_security_group_ids = [aws_security_group.ttt-sg.id]
  associate_public_ip_address = true

  tags = {
    Name = "ttt-server"
  }
}
