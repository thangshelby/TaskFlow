import { useState } from "react";
import { useUserProjects } from "@libs/hooks/apis/useProject";
import DropdownAntd from "../dropdown";
import { useNavigate } from "react-router-dom";

const ProjectDropdown = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { projects } = useUserProjects({ enabled: open });

  const options = (projects || []).map((project) => ({
    value: project?.id,
    label: project?.name,
  }));

  return (
    <div className="relative">
      <DropdownAntd
        open={open}
        onOpenChange={setOpen}
        options={options}
        placement="bottom"
        onClickItem={(option) => {
          navigate(`/projects/${option.value}`);
        }}
        menuClassName={"min-w-[120px]"}
        rowClassName="font-semibold text-gray-700"
        parent={<div className="flex items-center space-x-2">Projects</div>}
      />
    </div>
  );
};

export default ProjectDropdown;
