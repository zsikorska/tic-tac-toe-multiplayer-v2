resource "aws_ecr_repository" "ttt_backend_repo" {
  name                 = "ttt_backend_repo"
  image_tag_mutability = "MUTABLE"
}

resource "aws_ecr_repository" "ttt_frontend_repo" {
  name                 = "ttt_frontend_repo"
  image_tag_mutability = "MUTABLE"
}
